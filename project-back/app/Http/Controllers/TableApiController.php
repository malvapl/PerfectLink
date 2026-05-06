<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\Request;

class TableApiController extends Controller
{
   public function indexTables(Wedding $wedding)
   {
      $tables = $wedding->tables()->with('users')->get();
      return TableResource::collectionWithWedding($tables, $wedding);
   }

   public function storeTable(CreateTableRequest $request, string $idWedding)
   {
      $data = $request->all();
      $data['wedding_id'] = $idWedding;
      Table::create($data);

      $table = Table::latest()->with('users')->first();
      return new TableResource($table);
   }

   /**
    * Update table, attach guests from scratch
    */
   public function updateTable(UpdateTableRequest $request, Table $table)
   {
      $data = $request->all();

      if (!$table->update($data)) {
         return ['success' => false, 'message' => 'Error updating table'];
      }

      if (isset($data['guests'])) {
         foreach ($table->users()->get() as $user) {
            $table->users()->detach($user->id);
         }

         foreach ($data['guests'] as $guest) {
            $user = User::find($guest['id']);
            abort_if(!$user, response()->json(['message' => 'User not found'], 404));

            $table->users()->attach($user->id, ['plusOne' => str_contains($guest['name'], '(+1)'), 'numSeat' => $guest['numSeat']]);
         }
      }

      return ['success' => true];
   }

   public function destroyTable(Request $request, Wedding $wedding, Table $table)
   {
      $this->authorize('delete', $table);

      return ['success' => (bool) $table->delete()];
   }
}
