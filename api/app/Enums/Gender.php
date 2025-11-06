<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';
    case UNKNOWN = 'unknown';

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }
}
