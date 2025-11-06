<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case GUIDE = 'guide';
    case DRIVER = 'driver';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }

    public static function label(string $value)
    {
        return match ($value) {
            self::ADMIN->value => 'Administrador',
            self::GUIDE->value => 'Guía Turístico',
            self::DRIVER->value => 'Conductor',
            default => null
        };
    }
}
