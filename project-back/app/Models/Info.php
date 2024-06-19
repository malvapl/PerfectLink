<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
   use HasFactory;
   protected $fillable = ['title', 'subtitle', 'description', 'enabled', 'delete', 'wedding_id'];
   protected $hidden = ['created_at', 'updated_at'];
}
