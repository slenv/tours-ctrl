<?php

namespace App\Http\Controllers;

use App\Services\External\IdentityGateway;
use App\Traits\ApiResponse;

class IdentityController extends Controller
{
    use ApiResponse;

    public function __construct(protected IdentityGateway $identityGateway)
    {
    }

    public function dni(string $dni)
    {
        if (strlen($dni) !== 8) {
            return $this->jsonResponse(['message' => 'DNI debe tener 8 dígitos'], 400);
        }

        $data = $this->identityGateway->getByDni($dni);
        if (!$data) {
            return $this->jsonResponse(['message' => 'DNI no encontrado'], 404);
        }

        return $this->jsonResponse($data);
    }

    public function ruc(string $ruc)
    {
        if (strlen($ruc) !== 11) {
            return $this->jsonResponse(['message' => 'RUC debe tener 11 dígitos'], 400);
        }

        $data = $this->identityGateway->getByRuc($ruc);
        if (!$data) {
            return $this->jsonResponse(['message' => 'RUC no encontrado'], 404);
        }

        return $this->jsonResponse($data);
    }

    public function ce(string $ce)
    {
        if (strlen($ce) !== 9) {
            return $this->jsonResponse(['message' => 'Carnet de Extranjería debe tener 9 dígitos'], 400);
        }

        $data = $this->identityGateway->getByCe($ce);
        if (!$data) {
            return $this->jsonResponse(['message' => 'Carnet de Extranjería no encontrado'], 404);
        }

        return $this->jsonResponse($data);
    }
}
