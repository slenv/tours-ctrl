<?php

namespace App\Services\External;

use App\Adapters\IdentityAdapter;

class IdentityGateway
{
    public function __construct(
        protected FactilizaAPIService $factiliza,
        protected ApiPeruAPIService $apiPeru
    ) {
    }

    public function getByDni(string $dni)
    {
        try {
            $res = $this->apiPeru->getDni($dni);
            return IdentityAdapter::transformDni($res);
        } catch (\Throwable $th) {
            $res = $this->factiliza->getDni($dni);
            return IdentityAdapter::transformDni($res);
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function getByRuc(string $ruc)
    {
        try {
            $res = $this->apiPeru->getRuc($ruc);
            return IdentityAdapter::transformRuc($res);
        } catch (\Throwable $th) {
            $res = $this->factiliza->getRuc($ruc);
            return IdentityAdapter::transformRuc($res);
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function getByCe(string $ce)
    {
        try {
            $res = $this->factiliza->getCe($ce);
            return IdentityAdapter::transformCe($res);
        } catch (\Throwable $th) {
            return null;
        }
    }
}