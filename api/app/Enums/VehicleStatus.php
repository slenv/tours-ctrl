<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case ACTIVE = 'active';
    case OUT_OF_SERVICE = 'out_of_service';
    case UNAVAILABLE = 'unavailable';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }

    public static function label(string $value)
    {
        return match ($value) {
            self::ACTIVE->value => 'Activo',
            self::OUT_OF_SERVICE->value => 'Fuera de Servicio',
            self::UNAVAILABLE->value => 'No Disponible',
            default => null
        };
    }
}
