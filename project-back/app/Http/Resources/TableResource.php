<?php

namespace App\Http\Resources;

use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class TableResource extends JsonResource
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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'maxChairs' => $this->maxChairs,
            'pos_x' => $this->pos_x,
            'pos_y' => $this->pos_y,
            'guests' => $this->whenLoaded('users', function () {
                return $this->users->map(
                    fn($user) => new TableGuestResource($user, $this->wedding, $this->weddingGuests)
                );
            }),
        ];
    }

    public static function collectionWithWedding($tables, Wedding $wedding)
    {
        return static::collection(
            $tables->map(fn($table) => new static($table, $wedding))
        );
    }
}
