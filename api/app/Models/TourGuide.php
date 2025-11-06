<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourGuide extends Model
{
    protected $table = 'tour_guides';

    protected $fillable = [
        'tour_id',
        'guide_id',
        'vehicle_seat_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
