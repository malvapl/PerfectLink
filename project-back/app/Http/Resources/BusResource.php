<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    *
    * @return array<string, mixed>
    */
   public function toArray(Request $request): array
   {
      return [
         'id' => $this->id,
         'departure' => implode(':', [explode(':', $this->departure)[0], explode(':', $this->departure)[1]]),
         'direction' => $this->direction,
         'start' => $this->start,
         'end' => $this->end,
      ];
   }
}
