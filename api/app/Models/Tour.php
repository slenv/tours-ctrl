<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    protected $table = 'tours';

    protected $fillable = [
        'from',
        'to',
        'max_seats',
        'status',
        'tour_package_id',
        'vehicle_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'booked_passengers',
        'available_passengers',
    ];

    public function getBookedPassengersAttribute()
    {
        return 0;
    }

    public function getAvailablePassengersAttribute()
    {
        return $this->max_seats - $this->booked_passengers;
    }
}
