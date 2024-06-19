<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Wedding extends Model
{
   protected $hidden = ['created_at', 'updated_at'];
   protected $fillable = [
      'spouse1',
      'spouse2',
      'date',
      'startHour',
      'maxDateConfirmation',
      'locationCeremony',
      'locationParty',
      'location',
      'messageGuests',
      'codeGuest',
      'codeOrg',
      'numGuests',
      'ceremony',
      'bus',
      'prewedding'
   ];


   use HasFactory;

   public function tables()
   {
      return $this->hasMany(Table::class);
   }

   public function infos()
   {
      return $this->hasMany(Info::class);
   }

   public function prewedding()
   {
      return $this->hasOne(Prewedding::class);
   }

   public function buses()
   {
      return $this->hasMany(Bus::class);
   }

   public function users()
   {
      return $this->belongsToMany(User::class)
         ->withPivot('role_id', 'bus', 'prewedding')->withTimestamps();
   }

}
