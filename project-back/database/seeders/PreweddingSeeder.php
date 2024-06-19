<?php

namespace Database\Seeders;

use App\Models\Prewedding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PreweddingSeeder extends Seeder
{

   private $example = [
      'location' => 'Calle Preboda, 8, Tapia de Casariego',
      'time' => '20:00'
   ];

   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $pw = new Prewedding();
      $pw->location = $this->example['location'];
      $pw->time = $this->example['time'];
      $pw->wedding_id = 1;
      $pw->save();
   }
}
