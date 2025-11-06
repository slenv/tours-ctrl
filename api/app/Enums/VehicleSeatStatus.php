<?php

namespace App\Enums;

enum VehicleSeatStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
