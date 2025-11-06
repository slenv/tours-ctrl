<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(protected UserService $userService)
    {
    }

    public function store(Request $req)
    {
        $req->merge([
            'id' => (int) $req->id,
            'firstname' => ucwords(strtolower(trim($req->firstname))),
            'lastname' => ucwords(strtolower(trim($req->lastname))),
            'phone' => trim($req->phone),
            'language' => ucwords(strtolower(trim($req->language))),
            'license' => strtoupper(trim($req->license)),
            'username' => strtolower(trim($req->username)),
            'role' => strtolower(trim($req->role))
        ]);

        $data = $req->validate([
            'id' => 'nullable',
            'firstname' => 'required',
            'lastname' => 'required',
            'phone' => 'nullable',
            'language' => Rule::requiredIf($req->role === UserRole::GUIDE->value || $req->role === UserRole::DRIVER->value),
            'license' => Rule::requiredIf($req->role === UserRole::DRIVER->value),
            'username' => [
                Rule::unique('users', 'username')->ignore($req->id),
                'required'
            ],
            'role' => [
                Rule::in(UserRole::values()),
                'required'
            ],
        ]);

        try {
            return $this->jsonResponse($this->userService->save($data), 201);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function guides()
    {
        return $this->jsonResponse($this->userService->getGuides());
    }

    public function drivers()
    {
        return $this->jsonResponse($this->userService->getDrivers());
    }

    public function delete(string $id)
    {
        try {
            $deleted = $this->userService->deleteById((int) $id);
            if (!$deleted) {
                return $this->jsonResponse(['message' => 'El usuario no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Usuario eliminado']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }
}
