<?php

namespace App\Adapters;

class IdentityAdapter
{
    public static function transformDni($res)
    {
        if (!isset($res['data'])) {
            return null;
        }
        return [
            'doc_number' => $res['data']['numero'],
            'firstname' => ucwords(strtolower($res['data']['nombres'])),
            'lastname' => ucwords(strtolower($res['data']['apellido_paterno'] . ' ' . $res['data']['apellido_materno'])),
            'address' => $res['data']['direccion']
        ];
    }

    public static function transformRuc($res)
    {
        if (!isset($res['data'])) {
            return null;
        }
        return [
            'doc_number' => $res['data']['ruc'],
            'business_name' => strtoupper($res['data']['nombre_o_razon_social']),
            'address' => $res['data']['direccion_completa']
        ];
    }

    public static function transformCe($res)
    {
        if (!isset($res['data'])) {
            return null;
        }
        return [
            'doc_number' => $res['data']['numero'],
            'firstname' => ucwords(strtolower($res['data']['nombres'])),
            'lastname' => ucwords(strtolower($res['data']['apellido_paterno'] . ' ' . $res['data']['apellido_materno']))
        ];
    }
}
