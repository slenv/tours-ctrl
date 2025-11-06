<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Http;
use Log;

class ApiPeruAPIService
{
    protected $baseUrl;
    protected $token;

    public function __construct()
    {
        $this->baseUrl = config('services.api_peru.base_url');
        $this->token = config('services.api_peru.token');
    }

    public function getDni(string $dni)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->post("{$this->baseUrl}/dni", ['dni' => $dni]);

        if ($res->failed()) {
            $this->throwError($res->body());
        }

        return $res->json();
    }

    public function getRuc(string $ruc)
    {
        $res = Http::withHeaders($this->getHeaders())
            ->post("{$this->baseUrl}/ruc", ['ruc' => $ruc]);

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
        Log::error("API Peru: {$body}");
        throw new \Exception("Error consultando en API Peru: {$body}");
    }
}