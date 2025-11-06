<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Http;
use Log;

class FactilizaAPIService
{
    protected $baseUrl;
    protected $token;

    public function __construct()
    {
        $this->baseUrl = config('services.api_factiliza.base_url');
        $this->token = config('services.api_factiliza.token');
    }

    public function getDni(string $dni)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->get("{$this->baseUrl}/dni/info/{$dni}");

        if ($res->failed()) {
            $this->throwError($res->body());
        }

        return $res->json();
    }

    public function getRuc(string $ruc)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->get("{$this->baseUrl}/ruc/info/{$ruc}");

        if ($res->failed()) {
            $this->throwError($res->body());
        }

        return $res->json();
    }

    public function getCe(string $ce)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->get("{$this->baseUrl}/cee/info/{$ce}");

        if ($res->failed()) {
            $this->throwError($res->body());
        }

        return $res->json();
    }

    public function getPlate(string $plate)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->get("{$this->baseUrl}/placa/info/{$plate}");

        if ($res->failed()) {
            $this->throwError($res->body());
        }

        return $res->json();
    }

    private function getHeaders()
    {
        return [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer {$this->token}"
        ];
    }

    private function throwError(string $body)
    {
        Log::error("API Factiliza: {$body}");
        throw new \Exception("Error consultando en API Factiliza: {$body}");
    }
}