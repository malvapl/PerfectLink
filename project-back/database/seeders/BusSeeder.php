<?php

namespace Database\Seeders;

use App\Models\Bus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusSeeder extends Seeder
{

   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $pw = new Bus();
      $pw->departure = '13:00';
      $pw->direction = false;
      $pw->wedding_id = 1;
      $pw->start = 'Calle de la fiesta, 1, 28080 Asturias, España';
      $pw->end = 'Calle de la boda, 1, 28080 Asturias, España';
      $pw->save();

      $pw2 = new Bus();
      $pw2->departure = '23:00';
      $pw2->direction = true;
      $pw2->start = 'Calle de la boda, 1, 28080 Asturias, España';
      $pw2->end = 'Calle de la fiesta, 1, 28080 Asturias, España';
      $pw2->wedding_id = 1;
      $pw2->save();

      $pw3 = new Bus();
      $pw3->departure = '13:00';
      $pw3->direction = false;
      $pw3->wedding_id = 2;
      $pw3->start = 'Calle de la fiesta, 1, 28080 Madrid, España';
      $pw3->end = 'Calle de la boda, 1, 28080 Madrid, España';
      $pw3->save();
   }
}
