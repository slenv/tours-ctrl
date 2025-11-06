<?php

namespace App\Services;

use App\Enums\DocType;
use App\Models\Customer;
use App\Utils\QuerySearch;
use DB;

class CustomerService
{
    public function paginate(array $params)
    {
        $query = Customer::query();
        return QuerySearch::for($query)
            ->search(
                $params['search'] ?: null,
                ['doc_number', 'firstname', 'lastname', 'business_name', 'phone']
            )
            ->getQuery()
            ->orderBy('id', 'desc')
            ->paginate($params['per_page'] ?? 10, ['*'], 'page', $params['page'] ?? null);
    }

    public function cursorTrashed()
    {
        return Customer::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->cursor()
            ->map(fn($pAccount) => $pAccount->makeVisible(['deleted_at']));
    }

    public function save(array $data)
    {
        return DB::transaction(function () use ($data) {
            $customer = Customer::find($data['id']);
            if (!$customer) {
                $customer = new Customer();
            }

            $customer->doc_type_code = $data['doc_type_code'];
            $customer->doc_number = $data['doc_type_code'] !== DocType::NONE->value ? $data['doc_number'] : null;

            if ($data['doc_type_code'] === DocType::RUC->value) {
                $customer->business_name = $data['business_name'];
                $customer->firstname = null;
                $customer->lastname = null;
            } else {
                $customer->firstname = $data['firstname'];
                $customer->lastname = $data['lastname'];
                $customer->business_name = null;
            }

            $customer->phone = $data['phone'] ?: null;
            $customer->email = $data['email'] ?: null;
            $customer->address = $data['address'] ?: null;
            $customer->save();

            return $customer;
        });
    }

    public function deleteById(int $id)
    {
        return DB::transaction(function () use ($id) {
            $customer = Customer::find($id);
            if (!$customer) {
                return false;
            }
            return $customer->delete();
        });
    }

    public function restoreByIds(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $customers = Customer::onlyTrashed()->whereIn('id', $ids)->get();
            if ($customers->isEmpty()) {
                return 0;
            }
            return $customers->filter->restore()->count();
        });
    }
}
