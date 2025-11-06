<?php

namespace App\Enums;

enum PassengerStatus: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
