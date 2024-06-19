<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prewedding extends Model
{
   use HasFactory;
   protected $fillable = ['wedding_id', 'location', 'time'];
   protected $hidden = ['created_at', 'updated_at'];
}
