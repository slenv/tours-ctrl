<?php

namespace App\Http\Controllers;

use App\Services\PaymentAccountService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentAccountController extends Controller
{
    use ApiResponse;

    public function __construct(protected PaymentAccountService $paymentAccountService)
    {
    }

    public function all()
    {
        return $this->jsonResponse($this->paymentAccountService->cursorAll());
    }

    public function trashed()
    {
        return $this->jsonResponse($this->paymentAccountService->cursorTrashed());
    }

    public function store(Request $req)
    {
        $req->merge([
            'id' => (int) $req->id,
            'description' => trim($req->description),
            'reference' => trim($req->reference),
            'holder_name' => trim($req->holder_name),
        ]);

        $data = $req->validate([
            'id' => 'nullable',
            'description' => 'required|max:255',
            'reference' => [
                Rule::unique('payment_accounts', 'reference')->ignore($req->id),
                'required',
                'max:255',
            ],
            'holder_name' => 'required|max:255',
        ], [
            'reference.unique' => 'El No. Referencia ya fue registrado',
        ]);

        try {
            return $this->jsonResponse($this->paymentAccountService->save($data));
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function delete(string $id)
    {
        try {
            $deleted = $this->paymentAccountService->deleteById((int) $id);
            if (!$deleted) {
                return $this->jsonResponse(['message' => 'La cuenta de pago no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Cuenta de pago eliminada']);
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
            $restoredCount = $this->paymentAccountService->restoreByIds($ids);
            if ($restoredCount === 0) {
                return $this->jsonResponse(['message' => 'Ninguna cuenta de pago fue restaurada'], 404);
            }
            $message = $restoredCount === 1 ? "Cuenta de pago restaurada" : "{$restoredCount} cuentas de pago restauradas";
            return $this->jsonResponse(['message' => $message]);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function toggleStatus(string $id)
    {
        try {
            $toggled = $this->paymentAccountService->toggleStatus((int) $id);
            if (!$toggled) {
                return $this->jsonResponse(['message' => 'La cuenta de pago no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'Cuenta de pago actualizada']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function uploadQr(Request $req, string $id)
    {
        $req->validate(['qr' => 'required|image|mimes:jpg,jpeg,png|max:2048']);

        try {
            $pAccount = $this->paymentAccountService->uploadQr((int) $id, $req->file('qr'));
            if (!$pAccount) {
                return $this->jsonResponse(['message' => 'Cuenta de pago no existe'], 404);
            }
            return $this->jsonResponse([
                'message' => 'QR guardado correctamente',
                'data' => $pAccount
            ]);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

    public function deleteQr(string $id)
    {
        try {
            $deleted = $this->paymentAccountService->deleteQr((int) $id);
            if (!$deleted) {
                return $this->jsonResponse(['message' => 'QR no existe'], 404);
            }
            return $this->jsonResponse(['message' => 'QR eliminado correctamente']);
        } catch (\Exception $e) {
            return $this->jsonException($e);
        }
    }

}
