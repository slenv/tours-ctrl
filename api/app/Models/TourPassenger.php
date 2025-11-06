<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourPassenger extends Model
{
    protected $table = 'tour_passengers';

    protected $fillable = [
        'reservation_id',
        'passenger_id',
        'vehicle_seat_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
