<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'firstname',
        'lastname',
        'phone',
        'language',
        'license',
        'username',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'fullname',
        'shortname',
        'initials',
        'doc_number',
        'avatar_url',
    ];

    public function getFullnameAttribute()
    {
        return "{$this->firstname} {$this->lastname}";
    }

    public function getShortnameAttribute()
    {
        return explode(' ', $this->firstname)[0] . ' ' . explode(' ', $this->lastname)[0];
    }

    public function getInitialsAttribute()
    {
        return strtoupper(substr($this->firstname, 0, 1) . substr($this->lastname, 0, 1));
    }

    public function getDocNumberAttribute()
    {
        if (in_array($this->role, [UserRole::GUIDE->value, UserRole::DRIVER->value])) {
            return $this->username;
        }
        return null;
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return asset("avatars/defaults/{$this->id}.png");
        }
        if (!file_exists(public_path("avatars/{$this->avatar}"))) {
            return asset("avatars/defaults/{$this->id}.png");
        }
        return asset("avatars/{$this->avatar}");
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
