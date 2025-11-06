<?php

namespace App\Utils;

class StringFormat
{
    public function __construct(protected string $value)
    {
    }

    public static function for(string $value): self
    {
        return new static($value);
    }

    public function padLeft(int $length, string $fill): string
    {
        return str_pad($this->value, $length, $fill, STR_PAD_LEFT);
    }
}
