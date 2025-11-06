<?php

namespace App\Services;

use App\Models\Vehicle;
use DB;

class VehicleService
{
    public function cursorAll()
    {
        return Vehicle::orderBy('id', 'desc')
            ->cursor();
    }

    public function cursorTrashed()
    {
        return Vehicle::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->cursor();
    }

    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $vehicle = Vehicle::find($data['id']);
            if (!$vehicle) {
                $vehicle = new Vehicle();
            }

            $vehicle->plate = $data['plate'];
            $vehicle->color = $data['color'];
            $vehicle->seats = $data['seats'];
            $vehicle->brand = $data['brand'];
            $vehicle->model = $data['model'];
            $vehicle->owner = $data['owner'];
            $vehicle->save();

            return $vehicle;
        });
    }

    public function getVehicleByPlate(string $plate)
    {
        return Vehicle::whereRaw('lower(plate) = ?', [strtolower($plate)])
            ->with('vehicleSeats')
            ->first();
    }
}
