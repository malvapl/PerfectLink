<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmationRequest;
use App\Http\Requests\DeteleGuestsRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Resources\GuestResource;
use App\Http\Resources\WeddingDetailResource;
use App\Http\Resources\WeddingUserResource;
use App\Models\Bus;
use App\Models\Prewedding;
use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Laravel\Sanctum\PersonalAccessToken;

class GuestApiController extends Controller
{

   /**
    * Returns the guests of the specified wedding
    */
   public function index(string $id)
   {
      $wedding = Wedding::with('users')->findOrFail($id);
      $guests = $wedding->users()->withPivot('role_id', 'created_at', 'plusOne', 'infoMenu', 'suggestion', 'group')
         ->whereIn('role_id', [2, 3, 4])->get();
      return new ResourceCollection(GuestResource::customCollection($guests, $wedding->spouse1, $wedding->spouse2));
   }

   /**
    * Returns the CONFIRMED guests of the specified wedding that have not been assigned a table yet
    */
   public function guestsNotSeated(string $id)
   {
      $wedding = Wedding::with('users', 'tables.users')->findOrFail($id);
      $guests = $wedding->users()->withPivot('role_id', 'created_at', 'group', 'plusOne')->where('role_id', 3)->get();

      $tables = Table::where('wedding_id', $id)->get();
      $seatedGuestIds = [];
      foreach ($tables as $table) {
         foreach ($table->users as $user) {
            $seatedGuestIds[] = $user->id;
         }
      }

      $notSeatedGuests = $guests->filter(function ($guest) use ($seatedGuestIds) {
         return !in_array($guest->id, $seatedGuestIds);
      });

      return ['data' => GuestResource::customResourceTables($notSeatedGuests, $wedding->spouse1, $wedding->spouse2)];
   }

   public function confirmInvite(ConfirmationRequest $request, int $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
      } else {
         return ['error' => 'user not logged'];
      }

      $data = $request->all();
      $wedding = $user->weddings()->with('users')->withPivot('role_id')->where('wedding_id', $idWedding)->first();
      if (!$wedding) {
         return "Wedding not found";
      }

      $wedding->users()->updateExistingPivot($user->id, ['role_id' => 3, 'bus' => $data['bus'], 'prewedding' => $data['prewedding']]);
      if (isset($data['plusOne'])) {
         $wedding->users()->updateExistingPivot($user->id, ['plusOne' => $data['plusOne']]);
         $wedding['numGuests'] = $wedding['numGuests'] + 1;
         $wedding->save();
      }
      if (isset($data['infoMenu'])) $wedding->users()->updateExistingPivot($user->id, ['infoMenu' => $data['infoMenu']]);
      if (isset($data['suggestion'])) $wedding->users()->updateExistingPivot($user->id, ['suggestion' => $data['suggestion']]);
      if (isset($data['group'])) $wedding->users()->updateExistingPivot($user->id, ['group' => reFormatGroup($data['group'], $wedding->spouse1, $wedding->spouse2)]);

      return $wedding->users()->where('user_id', $user->id)->get();
   }

   public function cancelInvite(Request $request, int $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
      } else {
         return ['error' => 'user not logged'];
      }

      $wedding = $user->weddings()->with('users')->withPivot('role_id', 'plusOne')->where('wedding_id', $idWedding)->first();
      if (!$wedding) {
         return "Wedding not found";
      }

      $wedding->users()->updateExistingPivot($user->id, ['role_id' => 4, 'bus' => 0, 'prewedding' => 0, 'group' => null, 'infoMenu' => null, 'suggestion' => null]);
      if ($wedding->pivot->plusOne !== null) {
         $wedding->users()->updateExistingPivot($user->id, ['plusOne' => null]);
         $wedding['numGuests'] = $wedding['numGuests'] - 1;
      }
      $wedding['numGuests'] = $wedding['numGuests'] - 1;
      $wedding->save();

      return ['data' => 'success'];
   }

   /**
    * Calculates total of guests in the fields abilidated (bus, prewedding, confirmed)
    */
   public function dataGuests(string $id, Request $request)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $wedding = Wedding::with('users', 'buses', 'prewedding')->findOrFail($id);
      if (!$wedding) {
         return "Wedding not found";
      }

      $totalConfirmed = $wedding->users()->withPivot('role_id')->where('role_id', 3)->count();
      $totalConfirmed += $wedding->users()->withPivot('role_id')->where('role_id', 3)->where('plusOne', '!=', null)->count();
      if ($wedding->bus) {
         $totalBus = $wedding->users()->withPivot('bus')->where('bus', 1)->count();
         $totalBus += $wedding->users()->withPivot('bus')->where('bus', 1)->where('plusOne', '!=', null)->count();
      } else {
         $totalBus = 'none';
      }
      if ($wedding->bus){
         $totalPrewedding = $wedding->users()->withPivot('prewedding')->where('prewedding', 1)->count();
         $totalPrewedding += $wedding->users()->withPivot('prewedding')->where('prewedding', 1)->where('plusOne', '!=', null)->count();
      }
      return ['confirmed' => $totalConfirmed, 'bus' => $totalBus, 'prewedding' => $totalPrewedding];
   }

   public function guestGroups(Request $request, string $id)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $wedding = Wedding::findOrFail($id);
      if (!$wedding) {
         return "Wedding not found";
      }

      $type = DB::select('SHOW COLUMNS FROM user_wedding WHERE Field = "group"')[0]->Type;
      $type = str_replace(["enum('", ')'], "", $type);
      $values = array();
      foreach (explode(',', $type) as $value) {
         $value = trim($value, "'");
         $value = formatGroup($value, $wedding->spouse1, $wedding->spouse2);
         $values[] = $value;
      }
      return $values;
   }

   public function updateGroup(Request $request, string $idWedding, string $idGuest)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $wedding = Wedding::with('users')->findOrFail($idWedding);
      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
      }

      $guest = $wedding->users()->where('user_id', $idGuest)->first();
      if (!$guest) {
         return "Guest not found";
      }

      $data = $request->all();
      if ($data['group'] === null) {
         $group = null;
      } else {
         $group = reFormatGroup($data['group'], $wedding->spouse1, $wedding->spouse2);
      }
      $wedding->users()->updateExistingPivot($idGuest, ['group' => $group]);

      $guest = $wedding->users()->withPivot('role_id', 'created_at', 'plusOne', 'infoMenu', 'suggestion', 'group')
         ->where('user_id', $idGuest)->first();
      return GuestResource::customResource($guest, $wedding->spouse1, $wedding->spouse2);
   }

   /**
    * Removes the guests from the user_wedding table
    * 
    */
   public function delete(DeteleGuestsRequest $request, string $idWedding)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $ids = $request->all()['ids'];
      $wedding = Wedding::with('users', 'tables.users', 'infos')->findOrFail($idWedding);

      if (!$user->is_admin && $wedding->users()->withPivot('role_id')->where('role_id', 1)->where('user_id', $id_user)->count() === 0) {
         return ["Error" => "No tienes permisos para modificar esta boda"];
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
