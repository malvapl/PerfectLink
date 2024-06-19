<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuestResource extends JsonResource
{

    private static $spouse1;
    private static $spouse2;

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
            'lastname' => $this->lastname,
            'role' => $this->pivot->role_id, 
            'joined_at' => $this->pivot->created_at->format('d-m-Y'),
            'bus' => $this->pivot->bus,
            'prewedding' => $this->pivot->prewedding,
            'group' => formatGroup($this->pivot->group, self::$spouse1, self::$spouse2),
            'plusOne' => $this->pivot->plusOne,
            'infoMenu' => $this->pivot->infoMenu,
            'suggestion' => $this->pivot->suggestion,
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
            'name' => $request->name,
            'lastname' => $request->lastname,
            'role' => $request->pivot->role_id,
            'joined_at' => $request->pivot->created_at->format('d-m-Y'),
            'bus' => $request->pivot->bus,
            'prewedding' => $request->pivot->prewedding,
            'group' => formatGroup($request->pivot->group, self::$spouse1, self::$spouse2),
            'plusOne' => $request->pivot->plusOne,
            'infoMenu' => $request->pivot->infoMenu,
            'suggestion' => $request->pivot->suggestion,
        ];
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static function toArrayCustomTables($request): array
    {
        return [
            'id' => $request->id,
            'name' => ($request->name . " " .  $request->lastname),
            'group' => formatGroup($request->pivot->group, self::$spouse1, self::$spouse2),
            'plusOne' => $request->pivot->plusOne,
        ];
    }

    public static function customResource($resource, $spouse1, $spouse2): array
    {
        self::$spouse1 = $spouse1;
        self::$spouse2 = $spouse2;
        return self::toArrayCustom($resource);
    }

    public static function customCollection($resource, $spouse1, $spouse2): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        self::$spouse1 = $spouse1;
        self::$spouse2 = $spouse2;
        return parent::collection($resource);
    }

    public static function customResourceTables($resource, $spouse1, $spouse2): array
    {
        $result = [];
        self::$spouse1 = $spouse1;
        self::$spouse2 = $spouse2;
        foreach ($resource as $guest) {
            $result[] = self::toArrayCustomTables($guest);
        }
        return $result;
    }
}
