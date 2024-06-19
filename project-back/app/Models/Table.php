<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = ['maxChairs', 'name', 'wedding_id', 'pos_x', 'pos_y'];
    protected $hidden = ['created_at', 'updated_at'];


    use HasFactory;

    public function users()
    {
        return $this->belongsToMany(User::class, 'table_user')->withPivot('numSeat');
    }
}
