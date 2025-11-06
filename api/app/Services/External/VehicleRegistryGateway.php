<?php

namespace App\Services\External;

use App\Adapters\VehicleRegistryAdapter;

class VehicleRegistryGateway
{
    public function __construct(protected FactilizaAPIService $factiliza)
    {
    }

    public function getByPlate(string $plate)
    {
        try {
            $res = $this->factiliza->getPlate($plate);
            return VehicleRegistryAdapter::transformPlate($res);
        } catch (\Throwable $th) {
            return null;
        }
    }
}
