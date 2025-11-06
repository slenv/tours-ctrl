<?php

namespace App\Models;

use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $table = 'vehicles';

    protected $fillable = [
        'plate',
        'color',
        'seats',
        'brand',
        'model',
        'owner',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $attributes = [
        'status' => VehicleStatus::ACTIVE->value,
    ];

    protected $appends = [
        'owner_label',
        'status_label',
    ];

    public function getOwnerLabelAttribute()
    {
        return $this->owner ?: 'Propiedad de la empresa';
    }

    public function getStatusLabelAttribute()
    {
        return VehicleStatus::label($this->status);
    }

    public function vehicleSeats()
    {
        return $this->hasMany(VehicleSeat::class);
    }
}
