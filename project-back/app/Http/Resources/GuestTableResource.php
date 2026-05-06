<?php

namespace App\Http\Resources;

use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GuestTableResource extends JsonResource
{
    public function __construct(
        $resource,
        private ?Wedding $wedding = null
    ) {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name . ' ' . $this->lastname,
            'group' => formatGroup($this->pivot->group, $this->wedding?->spouse1, $this->wedding?->spouse2),
            'plusOne' => $this->pivot->plusOne,
        ];
    }

    public static function collectionWithWedding($guests, Wedding $wedding): AnonymousResourceCollection
    {
        return static::collection(
            $guests->map(fn($guest) => new static($guest, $wedding))
        );
    }
}
