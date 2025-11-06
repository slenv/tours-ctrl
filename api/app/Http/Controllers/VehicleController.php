<?php

namespace App\Http\Controllers;

use App\Services\VehicleService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    use ApiResponse;

    public function __construct(protected VehicleService $vehicleService)
    {
    }

    public function all()
    {
        return $this->jsonResponse($this->vehicleService->cursorAll());
    }

    public function show(Request $req)
    {
        if ($req->has('plate')) {
            $vehicle = $this->vehicleService->getVehicleByPlate($req->plate);
            if (!$vehicle) {
                return $this->jsonException(new \Exception('Vehículo no encontrado'), 404);
            }
            return $this->jsonResponse($vehicle);
        }

        abort(404, 'Not found');
    }

    public function trashed()
    {
        return $this->jsonResponse($this->vehicleService->cursorTrashed());
    }

    public function store(Request $req)
    {
        $req->merge([
            'id' => (int) $req->id,
            'plate' => strtoupper(trim($req->plate)),
            'color' => trim($req->color),
            'seats' => (int) $req->seats,
            'brand' => trim($req->brand),
            'model' => trim($req->model),
            'owner' => trim($req->owner),
        ]);

        $data = $req->validate([
            'id' => 'nullable',
            'plate' => [
                Rule::unique('vehicles', 'plate')->ignore($req->id),
                'required',
                'alpha_num',
                'size:6',
            ],
            'color' => 'required|max:100',
            'seats' => 'required|integer',
            'brand' => 'required|max:150',
            'model' => 'required|max:150',
            'owner' => 'nullable',
        ], [
            'plate.unique' => 'El No. Placa ya fue registrado'
        ]);

        try {
            return $this->jsonResponse($this->vehicleService->save($data));
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }
}
