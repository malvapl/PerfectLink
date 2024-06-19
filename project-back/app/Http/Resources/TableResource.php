<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TableResource extends JsonResource
{

    private static $users;


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'maxChairs' => $this->maxChairs,
            'guests' => self::$users,
            'pos_x' => $this->pos_x,
            'pos_y' => $this->pos_y,
        ];
    }

    public static function toArrayCustom($request): array
    {
        return [
            'id' => $request->id,
            'name' => $request->name,
            'maxChairs' => $request->maxChairs,
            'guests' => self::$users,
            'pos_x' => $request->pos_x,
            'pos_y' => $request->pos_y,
        ];
    }

    public static function customResource($resource, $wedding): array
    {
        $result = [];
        foreach ($resource as $table){
            self::$users = TableGuestResource::customResource(
                $table->users()->withPivot('numSeat', 'plusOne')->get(),
                $wedding
            );
            // self::$users = $table->users()->get();
            $result[] = self::toArrayCustom($table);
        }
        return $result;
    }
}
