<?php

namespace App\Http\Controllers;

use App\Enums\DocType;
use App\Services\CustomerService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    use ApiResponse;

    public function __construct(protected CustomerService $customerService)
    {
    }

    public function paginate(Request $req)
    {
        $params = [
            'search' => $req->search,
            'page' => $req->page ?: 1,
            'per_page' => $req->per_page ?: 10
        ];

        return $this->jsonResponse($this->customerService->paginate($params));
    }

    public function trashed()
    {
        return $this->jsonResponse($this->customerService->cursorTrashed());
    }

    public function store(Request $req)
    {
        $req->merge([
            'id' => (int) $req->id,
            'doc_type_code' => trim($req->doc_type_code),
            'doc_number' => strtoupper(trim($req->doc_number)),
            'firstname' => ucwords(strtolower(trim($req->firstname))),
            'lastname' => ucwords(strtolower(trim($req->lastname))),
            'business_name' => strtoupper(trim($req->business_name)),
            'phone' => trim($req->phone),
            'email' => trim($req->email),
            'address' => trim($req->address),
        ]);

        $docNumMaxDigits = in_array($req->doc_type_code, [DocType::DNI->value, DocType::CE->value, DocType::RUC->value])
            ? 'size:' . DocType::size($req->doc_type_code)
            : null;

        $data = $req->validate([
            'id' => 'nullable',
            'doc_type_code' => [
                Rule::in(DocType::values()),
                'required'
            ],
            'doc_number' => Rule::when(
                $req->doc_type_code !== DocType::NONE->value,
                [
                    Rule::unique('customers', 'doc_number')->ignore($req->id),
                    $docNumMaxDigits,
                    'required'
                ]
            ),
            'firstname' => Rule::requiredIf($req->doc_type_code !== DocType::RUC->value),
            'lastname' => Rule::requiredIf($req->doc_type_code !== DocType::RUC->value),
            'business_name' => Rule::requiredIf($req->doc_type_code === DocType::RUC->value),
            'phone' => 'nullable',
            'email' => 'nullable|email',
            'address' => 'nullable',
        ], [
            'doc_number.unique' => 'El No. Documento ya fue registrado',
        ]);

        try {
            return $this->jsonResponse($this->customerService->save($data), 201);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function delete(string $id)
    {
        try {
            $deleted = $this->customerService->deleteById((int) $id);
            if (!$deleted) {
                return $this->jsonResponse(['message' => 'El cliente no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Cliente eliminado']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function restore(Request $req)
    {
        $ids = $req->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|min:1',
        ])['ids'];

        try {
            $restoredCount = $this->customerService->restoreByIds($ids);
            if ($restoredCount === 0) {
                return $this->jsonResponse(['message' => 'Ningún cliente fue restaurado'], 404);
            }
            $message = $restoredCount === 1 ? "Cliente restaurado" : "{$restoredCount} clientes restaurados";
            return $this->jsonResponse(['message' => $message]);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }
}
