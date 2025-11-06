<?php

namespace App\Http\Controllers;

use App\Services\TourPackageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TourPackageController extends Controller
{
    use ApiResponse;

    public function __construct(protected TourPackageService $tourPackageService)
    {
    }

    public function all()
    {
        return $this->jsonResponse($this->tourPackageService->cursorAll());
    }

    public function trashed()
    {
        return $this->jsonResponse($this->tourPackageService->cursorTrashed());
    }

    public function store(Request $req)
    {
        $req->merge([
            'id' => (int) $req->id,
            'name' => trim($req->name),
            'description' => trim($req->description),
            'price' => $req->price,
        ]);

        $data = $req->validate([
            'id' => 'nullable',
            'name' => [
                Rule::unique('tour_packages', 'name')->ignore($req->id),
                'required'
            ],
            'description' => 'nullable',
            'price' => 'required|numeric',
        ]);

        try {
            return $this->jsonResponse($this->tourPackageService->save($data), 201);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function delete(string $id)
    {
        try {
            $deleted = $this->tourPackageService->deleteById((int) $id);
            if (!$deleted) {
                return $this->jsonResponse(['message' => 'El paquete no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Paquete eliminado']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function restore(string $id)
    {
        try {
            $restored = $this->tourPackageService->restoreById((int) $id);
            if (!$restored) {
                return $this->jsonResponse(['message' => 'El paquete no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Paquete restaurado']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }
}
