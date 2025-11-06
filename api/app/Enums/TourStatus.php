<?php

namespace App\Enums;

enum TourStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
