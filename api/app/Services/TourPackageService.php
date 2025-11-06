<?php

namespace App\Services;

use App\Models\TourPackage;
use DB;

class TourPackageService
{
    public function cursorAll()
    {
        return TourPackage::orderBy('id', 'desc')
            ->cursor();
    }

    public function cursorTrashed()
    {
        return TourPackage::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->cursor();
    }

    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $tourPackage = TourPackage::find($data['id']);
            if (!$tourPackage) {
                $tourPackage = new TourPackage();
            }

            $tourPackage->name = $data['name'];
            $tourPackage->description = $data['description'] ?: null;
            $tourPackage->price = $data['price'];
            $tourPackage->save();

            return $tourPackage;
        });
    }

    public function deleteById(int $id)
    {
        return DB::transaction(function () use ($id) {
            $tourPackage = TourPackage::find($id);
            if (!$tourPackage) {
                return false;
            }
            return $tourPackage->delete();
        });
    }

    public function restoreById(int $id)
    {
        return DB::transaction(function () use ($id) {
            $tourPackage = TourPackage::onlyTrashed()->find($id);
            if (!$tourPackage) {
                return false;
            }
            return $tourPackage->restore();
        });
    }
}
