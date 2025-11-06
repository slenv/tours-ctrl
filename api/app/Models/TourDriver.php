<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourDriver extends Model
{
    protected $table = 'tour_drivers';

    protected $fillable = [
        'tour_id',
        'driver_id',
        'vehicle_seat_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
