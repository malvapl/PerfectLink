<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Info;
use App\Models\Wedding;

class InfoSeeder extends Seeder
{

   private $infos = [
      [
         'title' => 'Alojamiento',
         'subtitle' => '¿Queréis recomendar hoteles por la zona?',
         'description' => 'Algunos hoteles cercanos son...'
      ],
      [
         'title' => 'Zapatos',
         'subtitle' => '¿Habrá cambio de zapatos?',
         'description' => 'Tendremos un cambio de calzado cómodo para que puedas bailar todo lo que quieras.'
      ],
      [
         'title' => 'Código de vestimenta',
         'subtitle' => '¿Tendréis un código específico?',
         'description' => 'El código de vestimenta es formal, pero no necesariamente de etiqueta.'
      ]
   ];

   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $numWeddings = Wedding::all()->count();
      for ($i = 1; $i <= $numWeddings; $i++) {
         foreach ($this->infos as $info) {
            $inf = new Info();
            $inf->title = $info['title'];
            $inf->subtitle = $info['subtitle'];
            $inf->description = $info['description'];
            $inf->enabled = false;
            $inf->delete = false;
            $inf->wedding_id = $i;
            $inf->save();
         }
      }
   }
}
