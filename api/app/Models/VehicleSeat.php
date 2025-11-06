<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleSeat extends Model
{
    protected $table = 'vehicle_seats';

    protected $fillable = [
        'label',
        'row',
        'rowspan',
        'col',
        'colspan',
        'status',
        'vehicle_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
