<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TableGuestResource extends JsonResource
{

   private static $wedding;
   private static $plusOne;
   private static $group;

   /**
    * Transform the resource into an array.
    *
    * @return array<string, mixed>
    */
   public function toArray(Request $request): array
   {
      return [
         'id' => $this->id,
         'name' => ($this->name . " " .  $this->lastname),
         // 'numSeat' => self::$numSeat,
         'numSeat' => $request->pivot->numSeat,
         'group' => formatGroup($this->pivot->group, self::$wedding->spouse1, self::$wedding->spouse2),
         'plusOne' => $this->pivot->plusOne,
      ];
   }

   /**
    * Transform the resource into an array.
    *
    * @return array<string, mixed>
    */
   public static function toArrayCustom($request): array
   {
      return [
         'id' => $request->id,
         'name' => ($request->name . " " .  $request->lastname),
         'numSeat' => $request->pivot->numSeat,
         'isPlusOne' => $request->pivot->plusOne,
         'group' => formatGroup(self::$group, self::$wedding->spouse1, self::$wedding->spouse2),
         'plusOne' => self::$plusOne,
      ];
   }

   public static function customResource($resource, $wedding): array
   {
      self::$wedding = $wedding;
      $result = [];
      foreach ($resource as $guest) {
         $weddingGuest = $wedding->users()->withPivot('role_id', 'plusOne', 'group')->where('user_id', $guest->id)->get();
         self::$group = $weddingGuest->first()->pivot->group;
         self::$plusOne = $weddingGuest->first()->pivot->plusOne;
         // self::$numSeat = $allGuests->where('user_id', $id);
         $result[] = self::toArrayCustom($guest);
      }
      // return $resource[0];
      // $table = $resource->tables()->where('user_id', $resource->id)->first();
      // self::$numSeat = $table;
      return $result;
   }
}
