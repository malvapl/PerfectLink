<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmationRequest;
use App\Http\Requests\DeteleGuestsRequest;
use App\Http\Resources\GuestResource;
use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

class GuestApiController extends Controller
{

   /**
    * Return the guests of the specified wedding, along with the spouses
    */
   public function index(string $idWedding)
   {
      $wedding = Wedding::with('users')->findOrFail($idWedding);
      $guests = $wedding->users()->withPivot('role_id', 'created_at', 'plusOne', 'infoMenu', 'suggestion', 'group')
         ->whereIn('role_id', [2, 3, 4])->get();

      return new ResourceCollection(GuestResource::customCollection($guests, $wedding->spouse1, $wedding->spouse2));
   }

   /**
    * Return the CONFIRMED guests of the specified wedding that have not been assigned a table yet
    */
   public function guestsNotSeated(string $idWedding)
   {
      $wedding = Wedding::with('users', 'tables.users')->findOrFail($idWedding);
      $guests = $wedding->users()->withPivot('role_id', 'created_at', 'group', 'plusOne')->where('role_id', 3)->get();

      $tables = Table::where('wedding_id', $idWedding)->get();
      $seatedGuestIds = [];
      foreach ($tables as $table) {
         foreach ($table->users as $user) {
            $seatedGuestIds[] = $user->id;
         }
      }

      $notSeatedGuests = $guests->filter(function ($guest) use ($seatedGuestIds) {
         return !in_array($guest->id, $seatedGuestIds);
      });

      return GuestResource::customResourceTables($notSeatedGuests, $wedding->spouse1, $wedding->spouse2); //?
   }

   public function confirmInvite(ConfirmationRequest $request, int $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $data = $request->all();
      $wedding = $user->weddings()->with('users')->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $wedding->users()->updateExistingPivot($id_user, ['role_id' => 3, 'bus' => $data['bus'], 'prewedding' => $data['prewedding']]);
      if (isset($data['plusOne'])) {
         $wedding->users()->updateExistingPivot($id_user, ['plusOne' => $data['plusOne']]);
         $wedding['numGuests'] = $wedding['numGuests'] + 1;
         $wedding->save();
      }
      if (isset($data['infoMenu'])) {
         $wedding->users()->updateExistingPivot($id_user, ['infoMenu' => $data['infoMenu']]);
      }
      if (isset($data['suggestion'])) {
         $wedding->users()->updateExistingPivot($id_user, ['suggestion' => $data['suggestion']]);
      }
      if (isset($data['group'])) {
         $wedding->users()->updateExistingPivot($id_user, ['group' => reFormatGroup($data['group'], $wedding->spouse1, $wedding->spouse2)]);
      }

      return $wedding->users()->where('user_id', $id_user)->get();
   }

   /**
    * Cancel invite
    */
   public function cancelInvite(Request $request, int $idWedding)
   {
      $user = $request->user();

      $wedding = $user->weddings()->with('users')->withPivot('role_id', 'plusOne')->where('wedding_id', $idWedding)->first();
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $wedding->users()->updateExistingPivot($user->id, ['role_id' => 4, 'bus' => 0, 'prewedding' => 0, 'group' => null, 'infoMenu' => null, 'suggestion' => null]);
      if ($wedding->pivot->plusOne !== null) {
         $wedding->users()->updateExistingPivot($user->id, ['plusOne' => null]);
         $wedding['numGuests'] = $wedding['numGuests'] - 1;
      }
      $wedding['numGuests'] = $wedding['numGuests'] - 1;

      return ['success' => (bool) $wedding->save()];
   }

   /**
    * Calculate total of guests in the fields abilidated (bus, prewedding, confirmed)
    */
   public function dataGuests(string $idWedding, Request $request)
   {
      $wedding = Wedding::with('users', 'buses', 'prewedding')->findOrFail($idWedding);
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $totalConfirmed = $wedding->users()->withPivot('role_id')->where('role_id', 3)->count();
      $totalConfirmed += $wedding->users()->withPivot('role_id')->where('role_id', 3)->where('plusOne', '!=', null)->count();

      if ($wedding->bus) {
         $totalBus = $wedding->users()->withPivot('bus')->where('bus', 1)->count();
         $totalBus += $wedding->users()->withPivot('bus')->where('bus', 1)->where('plusOne', '!=', null)->count();
      }

      if ($wedding->bus) {
         $totalPrewedding = $wedding->users()->withPivot('prewedding')->where('prewedding', 1)->count();
         $totalPrewedding += $wedding->users()->withPivot('prewedding')->where('prewedding', 1)->where('plusOne', '!=', null)->count();
      }
      return ['confirmed' => $totalConfirmed, 'bus' => $totalBus ?? 'none', 'prewedding' => $totalPrewedding ?? 'none'];
   }

   /**
    * Get guest groups by wedding
    */
   public function guestGroups(Request $request, string $idWedding)
   {
      $wedding = Wedding::findOrFail($idWedding);
      abort_if(!$wedding, response()->json(['message' => 'Wedding not found'], 404));

      $type = DB::select('SHOW COLUMNS FROM user_wedding WHERE Field = "group"')[0]->Type;
      $type = str_replace(['enum(\'', ')'], '', $type);
      $values = [];

      foreach (explode(',', $type) as $value) {
         $value = trim($value, "'");
         $value = formatGroup($value, $wedding->spouse1, $wedding->spouse2);
         $values[] = $value;
      }

      return ['data' => $values];
   }

   /**
    * Update guest group in wedding
    */
   public function updateGroup(Request $request, string $idWedding, string $idGuest)
   {
      $user = $request->user();
      $id_user = $user->id;

      $wedding = Wedding::with('users')->findOrFail($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para ver esta boda'], 400));
      }

      $guest = $wedding->users()->where('user_id', $idGuest)->first();
      abort_if(!$guest, response()->json(['message' => 'Guest not found'], 404));

      $data = $request->all();

      $group = null;
      if ($data['group'] !== null) {
         $group = reFormatGroup($data['group'], $wedding->spouse1, $wedding->spouse2);
      }
      $wedding->users()->updateExistingPivot($idGuest, ['group' => $group]);

      $guest = $wedding->users()->withPivot('role_id', 'created_at', 'plusOne', 'infoMenu', 'suggestion', 'group')
         ->where('user_id', $idGuest)->first();

      return GuestResource::customResource($guest, $wedding->spouse1, $wedding->spouse2);
   }

   /**
    * Remove guests from wedding
    */
   public function delete(DeteleGuestsRequest $request, string $idWedding)
   {
      $user = $request->user();
      $id_user = $user->id;

      $ids = $request->all()['ids'];
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         abort(response()->json(['message' => 'No tienes permisos para ver esta boda'], 400));
      }

      $countTable = 0;
      foreach ($ids as $id) {
         $guest = User::findOrFail($id);
         $countTable += $guest->tables()->where('user_id', $id)->detach();
      }

      $count = $wedding->users()->detach($ids);
      $wedding['numGuests'] = $wedding['numGuests'] - $count;

      return ['numberDeleted' => $count, 'numberTableDeleted' => $countTable];
   }
}
