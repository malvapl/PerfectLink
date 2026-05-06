<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmationRequest;
use App\Http\Requests\DeteleGuestsRequest;
use App\Http\Resources\GuestResource;
use App\Http\Resources\GuestTableResource;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GuestApiController extends Controller
{

   /**
    * Return the guests of the specified wedding, along with the spouses
    */
   public function index(Wedding $wedding)
   {
      $wedding->load('users');
      $guests = $wedding->users()->withPivot('role_id', 'created_at', 'plusOne', 'infoMenu', 'suggestion', 'group')
         ->whereIn('role_id', [2, 3, 4])->get();

      return GuestResource::collectionWithWedding($guests, $wedding);
   }

   /**
    * Return the CONFIRMED guests of the specified wedding that have not been assigned a table yet
    */
   public function guestsNotSeated(Wedding $wedding)
   {
      $wedding->load('users', 'tables.users');

      $seatedGuestIds = $wedding->tables->flatMap(fn($table) => $table->users->pluck('id'));

      $notSeatedGuests = $wedding->users()
         ->withPivot('role_id', 'created_at', 'group', 'plusOne')
         ->where('role_id', 3)
         ->whereNotIn('users.id', $seatedGuestIds)
         ->get();

      return GuestTableResource::collectionWithWedding($notSeatedGuests, $wedding);
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

      return ['success' => true];
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
   public function dataGuests(Wedding $wedding, Request $request)
   {
      $wedding->load('users', 'buses', 'prewedding');
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
   public function guestGroups(Request $request, Wedding $wedding)
   {
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
   public function updateGroup(Request $request, Wedding $wedding, string $idGuest)
   {
      $wedding->load('users');

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

      return new GuestResource($guest, $wedding);
   }

   /**
    * Remove guests from wedding
    */
   public function delete(DeteleGuestsRequest $request, Wedding $wedding)
   {
      $ids = $request->all()['ids'];
      $wedding->load('users', 'tables.users', 'infos');

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
