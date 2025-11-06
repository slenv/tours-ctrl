<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case PENDING = 'pending';
    case FINISHED = 'finished';
    case CANCELLED = 'cancelled';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
