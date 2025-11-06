<?php

namespace App\Enums;

enum DocType: string
{
    case NONE = '0';
    case DNI = '1';
    case CE = '4';
    case RUC = '6';

    public static function label(string $value)
    {
        return match ($value) {
            self::NONE->value => 'Sin Documento',
            self::DNI->value => 'Documento Nacional de Identidad',
            self::CE->value => 'Carnet de Extranjería',
            self::RUC->value => 'Registro Único de Contribuyentes',
            default => null
        };
    }

    public static function abbreviation(string $value)
    {
        return match ($value) {
            self::NONE->value => 'SD',
            self::DNI->value => 'DNI',
            self::CE->value => 'CE',
            self::RUC->value => 'RUC',
            default => null
        };
    }

    public static function size(string $value)
    {
        return match ($value) {
            self::NONE->value => 0,
            self::DNI->value => 8,
            self::CE->value => 9,
            self::RUC->value => 11,
            default => 0
        };
    }

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
