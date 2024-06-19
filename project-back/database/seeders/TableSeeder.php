<?php

namespace Database\Seeders;

use App\Models\Table;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{

   private $tables = [
      [
         'name' => 'Primos',
         'maxChairs' => 6,
         'wedding_id' => 1,
         'skip' => 0,
         'numUsers' => 3,
         'pos_x' => 400,
         'pos_y' => 400,
      ],
      [
         'name' => 'Principal',
         'maxChairs' => 8,
         'wedding_id' => 1,
         'skip' => 5,
         'numUsers' => 2,
         'pos_x' => 600,
         'pos_y' => 300,
      ],
      [
         'name' => 'Primos',
         'maxChairs' => 12,
         'wedding_id' => 2,
         'skip' => 0,
         'numUsers' => 5,
         'pos_x' => 0,
         'pos_y' => 0,
      ],
      [
         'name' => 'Primos',
         'maxChairs' => 12,
         'wedding_id' => 2,
         'skip' => 5,
         'numUsers' => 5,
         'pos_x' => 0,
         'pos_y' => 0,
      ],
      [
         'name' => 'Primos',
         'maxChairs' => 12,
         'wedding_id' => 2,
         'skip' => 10,
         'numUsers' => 5,
         'pos_x' => 0,
         'pos_y' => 0,
      ],
   ];
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      foreach ($this->tables as $table) {
         $t = new Table();
         $t->name = $table['name'];
         $t->maxChairs = $table['maxChairs'];
         $t->wedding_id = $table['wedding_id'];
         $t->pos_x = $table['pos_x'];
         $t->pos_y = $table['pos_y'];
         $t->save();

         // $usuarios = User::whereHas('weddings', function ($query) use ($table) {
         //    $query->where('wedding_id', 'LIKE', $table['wedding_id']);
         // })->get();
         // $ids = $usuarios->skip($table['skip'])->take($table['numUsers'])->pluck('id');
         // $cont = 1;
         // foreach ($ids as $idUser) {
         //    $t->users()->attach($idUser, ['plusOne' => 0, 'numSeat' => $cont]);
         //    $cont++;
         // }
      }
   }
}
