<?php

namespace App\Http\Resources;

use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class TableGuestResource extends JsonResource
{

   public function __construct(
      $resource,
      private ?Wedding $wedding = null,
      private ?Collection $weddingGuests = null
   ) {
      parent::__construct($resource);
   }

   public function toArray(Request $request): array
   {
      $weddingPivot = $this->weddingGuests?->get($this->id)?->pivot;

      return [
         'id' => $this->id,
         'name' => $this->name . ' ' . $this->lastname,
         'numSeat' => $this->pivot->numSeat,
         'isPlusOne' => $this->pivot->plusOne,
         'group' => $weddingPivot
            ? formatGroup($weddingPivot->group, $this->wedding->spouse1, $this->wedding->spouse2)
            : null,
         'plusOne' => $weddingPivot?->plusOne,
      ];
   }
}
