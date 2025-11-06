<?php

namespace App\Adapters;

class VehicleRegistryAdapter
{
    public static function transformPlate($res)
    {
        if (!isset($res['data'])) {
            return null;
        }
        return [
            'license_plate' => $res['data']['placa'],
            'brand' => $res['data']['marca'],
            'model' => $res['data']['modelo'],
            'color' => $res['data']['color'],
            'serial_num' => $res['data']['serie'],
            'engine_num' => $res['data']['motor']
        ];
    }
}
