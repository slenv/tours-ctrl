<?php

namespace App\Services;

use App\Enums\PaymentAccountStatus;
use App\Models\PaymentAccount;
use DB;
use File;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class PaymentAccountService
{
    public function cursorAll()
    {
        return PaymentAccount::orderBy('id', 'desc')
            ->cursor();
    }

    public function cursorTrashed()
    {
        return PaymentAccount::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->cursor()
            ->map(fn($pAccount) => $pAccount->makeVisible(['deleted_at']));
    }

    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $pAccount = PaymentAccount::find($data['id']);
            if (!$pAccount) {
                $pAccount = new PaymentAccount();
            }

            $pAccount->description = $data['description'];
            $pAccount->reference = $data['reference'];
            $pAccount->holder_name = $data['holder_name'];
            $pAccount->save();

            return $pAccount;
        });
    }

    public function deleteById(int $id)
    {
        return DB::transaction(function () use ($id) {
            $pAccount = PaymentAccount::find($id);
            if (!$pAccount) {
                return false;
            }
            return $pAccount->delete();
        });
    }

    public function restoreByIds(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $pAccounts = PaymentAccount::onlyTrashed()->whereIn('id', $ids)->get();
            if ($pAccounts->isEmpty()) {
                return 0;
            }
            return $pAccounts->filter->restore()->count();
        });
    }

    public function toggleStatus(int $id)
    {
        return DB::transaction(function () use ($id) {
            $pAccount = PaymentAccount::find($id);
            if (!$pAccount) {
                return false;
            }
            $pAccount->status = PaymentAccountStatus::from($pAccount->status)
                ->toggle()->value;
            return $pAccount->save();
        });
    }

    public function uploadQr(int $id, UploadedFile $file)
    {
        return DB::transaction(function () use ($id, $file) {
            $pAccount = PaymentAccount::find($id);
            if (!$pAccount) {
                return false;
            }

            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = public_path('qrs');

            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0755, true);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getRealPath());
            $maxPx = 500;

            if ($image->width() > $maxPx || $image->height() > $maxPx) {
                $image = $image->scaleDown($maxPx, $maxPx);
            }

            $image->save("{$path}/{$filename}");

            // borrar qr anterior si existe
            if ($pAccount->qr && File::exists("{$path}/{$pAccount->qr}")) {
                File::delete("{$path}/{$pAccount->qr}");
            }

            $pAccount->qr = $filename;
            $pAccount->save();

            return $pAccount;
        });
    }

    public function deleteQr(int $id)
    {
        return DB::transaction(function () use ($id) {
            $pAccount = PaymentAccount::find($id);
            if (!$pAccount || !$pAccount->qr) {
                return false;
            }

            $path = public_path("qrs/{$pAccount->qr}");
            if (File::exists($path)) {
                File::delete($path);
            }

            $pAccount->qr = null;
            $pAccount->save();

            return true;
        });
    }
}
