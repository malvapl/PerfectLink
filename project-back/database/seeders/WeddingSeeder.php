<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wedding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WeddingSeeder extends Seeder
{

   const GROUPS = [
      'Familia de spouse1',
      'Familia de spouse2',
      'Amigos de spouse1',
      'Amigos de spouse2',
      'Trabajo de spouse1',
      'Trabajo de spouse2',
      'Amigos comunes',
      'Otros'
   ];

   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $w = new Wedding();
      $w->codeGuest = generateUniqueCode();
      $w->codeOrg = generateUniqueCode();
      $w->spouse1 = 'Andrea';
      $w->spouse2 = 'Nicolás';
      $w->date = '2024-09-16';
      $w->startHour = '12:00';
      $w->maxDateConfirmation = '2024-08-15';
      $w->location = 'Asturias';
      $w->ceremony = true;
      $w->locationCeremony = 'Tapia de Casariego';
      $w->locationParty = 'Ferpel, Ortiguera';
      $w->messageGuests = 'Es un placer para nosotros invitaros a compartir este día...';
      $w->numGuests = 60;
      $w->bus = true;
      $w->prewedding = true;
      $w->save();

      $idOrg = User::role('organizer')->first()->id;
      $w->users()->attach($idOrg, ['role_id' => 1, 'bus' => 0, 'prewedding' => 0]);

      $primerasIds = User::role('guestPending')->skip(0)->take(60)->pluck('id');
      foreach ($primerasIds as $idUser) {
         $group = self::GROUPS[rand(0, 7)];
         $plusOne = rand(0, 1) === 0 ? null : fake()->name();
         $infoMenu = rand(0, 1) === 0 ? null : fake()->sentence(5);
         $suggestion = rand(0, 1) === 0 ? null : fake()->sentence(15);
         $w->users()->attach($idUser, ['role_id' => rand(2, 4), 'bus' => rand(0, 1), 'prewedding' => rand(0, 1), 'group' => $group, 'plusOne' => $plusOne, 'infoMenu' => $infoMenu, 'suggestion' => $suggestion]);
      }

      $w2 = new Wedding();
      $w2->codeGuest = generateUniqueCode();
      $w2->codeOrg = generateUniqueCode();
      $w2->spouse1 = 'Cristina';
      $w2->spouse2 = 'Elía';
      $w2->date = '2023-10-09';
      $w2->startHour = '16:00';
      $w2->location = 'Menorca';
      $w2->ceremony = false;
      $w2->locationCeremony = 'Mahón, Menorca';
      $w2->locationParty = 'Ciudadela';
      $w2->messageGuests = 'Llevamos muchos años juntos y queríamos celebrar con vosotros...';
      $w2->numGuests = 40;
      $w2->bus = false;
      $w2->prewedding = false;
      $w2->save();

      $idOrg2 = User::role('organizer')->skip(1)->first()->id;
      $w2->users()->attach($idOrg2, ['role_id' => 1, 'bus' => null, 'prewedding' => null]);

      $ultimasIds = User::role('guestPending')->skip(60)->take(40)->pluck('id');
      foreach ($ultimasIds as $idUser) {
         $group = self::GROUPS[rand(0, 7)];
         $w2->users()->attach($idUser, ['role_id' => rand(2, 4), 'group' => $group]);
      }
   }
}
