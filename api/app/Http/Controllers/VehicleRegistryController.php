<?php

namespace App\Http\Controllers;

use App\Services\External\VehicleRegistryGateway;
use App\Traits\ApiResponse;

class VehicleRegistryController extends Controller
{
    use ApiResponse;

    public function __construct(protected VehicleRegistryGateway $vehicleRegistryGateway)
    {
    }

    public function plate(string $plate)
    {
        if (strlen($plate) != 6) {
            return $this->jsonResponse(['message' => 'Placa debe tener 6 dígitos'], 400);
        }

        $data = $this->vehicleRegistryGateway->getByPlate($plate);
        if (!$data) {
            return $this->jsonResponse(['message' => 'Placa no encontrada'], 404);
        }

        return $this->jsonResponse($data);
    }
}
