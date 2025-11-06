<?php

namespace App\Enums;

enum PaymentAccountStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public function toggle()
    {
        return $this->value === self::ACTIVE->value
            ? self::INACTIVE
            : self::ACTIVE;
    }

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }

    public static function label(string $value)
    {
        return match ($value) {
            self::ACTIVE->value => 'Activo',
            self::INACTIVE->value => 'Inactivo',
            default => null
        };
    }
}
