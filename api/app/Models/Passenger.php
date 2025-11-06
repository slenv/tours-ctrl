<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    protected $table = 'passengers';

    protected $fillable = [
        'doc_type_code',
        'doc_number',
        'firstname',
        'lastname',
        'phone',
        'birthdate',
        'gender',
        'status',
        'country_code',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'age',
        'age_stage',
    ];

    public function getAgeAttribute()
    {
        if (!$this->birthdate) {
            return null;
        }
        return Carbon::parse($this->birthdate)->age;
    }

    public function getAgeStageAttribute(): string
    {
        if (!$this->age) {
            return null;
        }

        return match (true) {
            $this->age < 18 => 'Mayor de edad',
            default => 'Mayor de edad',
        };
    }
}
