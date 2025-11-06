<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuthService $authService)
    {
    }

    public function login(Request $req)
    {
        $credentials = $req->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $token = $this->authService->login($credentials);
        if (!$token) {
            return $this->jsonResponse(['message' => 'Credenciales inválidas'], 401);
        }

        return $this->jsonResponse(['token' => $token], 201);
    }

    public function me()
    {
        return $this->jsonResponse($this->authService->getUser());
    }

    public function logout()
    {
        $this->authService->logout();
        return $this->jsonResponse(['message' => 'Sesión cerrada']);
    }

    public function refresh()
    {
        $token = $this->authService->refresh();
        return $this->jsonResponse(['token' => $token]);
    }
}
