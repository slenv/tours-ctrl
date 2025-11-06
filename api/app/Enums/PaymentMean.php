<?php

namespace App\Enums;

enum PaymentMean: string
{
    case CASH = 'cash';
    case DIGITAL = 'digital';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
