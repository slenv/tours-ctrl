<?php

namespace App\Traits;

use Illuminate\Database\QueryException;

trait ApiResponse
{
    protected function jsonResponse(array|object $data, int $code = 200): \Illuminate\Http\JsonResponse
    {
        return response()->json($data, $code);
    }

    protected function jsonException(\Exception $exception, int $code = 500): \Illuminate\Http\JsonResponse
    {
        return $this->jsonResponse([
            'message' => $exception->getMessage(),
            'trace' => [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]
        ], $code);
    }
}
