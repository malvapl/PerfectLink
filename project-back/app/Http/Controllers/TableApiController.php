<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTableRequest;
use App\Http\Requests\UpdateSeatsTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Resources\GuestResource;
use App\Http\Resources\TableResource;
use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Laravel\Sanctum\PersonalAccessToken;

class TableApiController extends Controller
{
   public function indexTables(Wedding $wedding)
   {
      $tables = $wedding->tables()->with('users')->get();
      return ['data' => TableResource::customResource($tables, $wedding)];
   }

   public function storeTable(CreateTableRequest $request, string $id)
   {
      $data = $request->all();
      $data['wedding_id'] = $id;
      Table::create($data);

      $table = Table::latest()->with('users')->first();
      return new TableResource($table);
   }

   public function updateTable(UpdateTableRequest $request, Table $table)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
         $id_user = $user->id;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $data = $request->all();
      $table->update($data);

      if (isset($data['guests'])) {
         foreach ($table->users()->get() as $user) {
            $table->users()->detach($user->id);
         }
         foreach ($data['guests'] as $guest) {
            // return $guest;
            $user = User::find($guest['id']);
            if (!$user) {
               return response()->json(["Error" => "Usuario no encontrado"], 404);
            }

            if (str_contains($guest['name'], '(+1)')) {
               $table->users()->attach($user->id, ['plusOne' => 1, 'numSeat' => $guest['numSeat']]);
            } else {
               $table->users()->attach($user->id, ['plusOne' => 0, 'numSeat' => $guest['numSeat']]);
            }
         }
      }

      return $table->users()->withPivot('plusOne')->get();

      return new TableResource($table);
   }

   public function destroyTable(Request $request, Wedding $wedding, string $id)
   {
      if ($request->bearerToken() !== null) {
         $token = $request->bearerToken();
         $personalAccessToken = PersonalAccessToken::findToken($token);
         $user = $personalAccessToken->tokenable;
      } else {
         return ["Error" => "Usuario no logeado"];
      }

      $wedding->tables()->find($id)->delete();
      return ['response' => 'success'];
   }
}
