<?php

namespace App\Http\Resources;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeddingDetailResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    *
    * @return array<string, mixed>
    */
   public function toArray(Request $request): array
   {
      $infos = InfoResource::collection($this->whenLoaded('infos'));
      return [
         'spouse1' => $this->spouse1,
         'spouse2' => $this->spouse2,
         'codeGuest' => $this->codeGuest,
         'codeOrg' => $this->codeOrg,
         'date' => $this->date,
         'startHour' => implode(':', [explode(':', $this->startHour)[0], explode(':', $this->startHour)[1]]),
         'maxDateConfirmation' => $this->maxDateConfirmation,
         'location' => $this->location,
         'ceremony' => $this->ceremony,
         'locationCeremony' => $this->locationCeremony,
         'locationParty' => $this->locationParty,
         'messageGuests' => $this->messageGuests,
         'numGuests' => $this->numGuests,
         'bus' => $this->bus,
         'prewedding' => $this->prewedding,
         'infos' => $infos
      ];
   }
}
