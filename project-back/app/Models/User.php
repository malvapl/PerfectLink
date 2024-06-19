<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Resources\WeddingUserResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasApiTokens;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'lastname',
        'email',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    public function weddings()
    {
        return $this->belongsToMany(Wedding::class, 'user_wedding')
            ->withPivot('role_id', 'bus', 'prewedding')->withTimestamps();
    }

    public function tables()
    {
        return $this->belongsToMany(Table::class, 'table_user')->withPivot('numSeat');
    }

    public function hasOwnWedding()
    {
        $wedding = $this->weddings()->withPivot('role_id')->where('role_id', 1)->first();
        if (!$wedding) {
            return 0;
        }
        return $wedding->id;
    }
}
