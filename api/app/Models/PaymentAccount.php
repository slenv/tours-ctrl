<?php

namespace App\Models;

use App\Enums\PaymentAccountStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentAccount extends Model
{
    use SoftDeletes;

    protected $table = 'payment_accounts';

    protected $fillable = [
        'description',
        'reference',
        'holder_name',
        'qr',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $attributes = [
        'status' => PaymentAccountStatus::ACTIVE->value,
    ];

    protected $appends = [
        'qr_url',
        'status_label',
    ];

    public function getQrUrlAttribute()
    {
        if (!$this->qr) {
            return null;
        }
        if (!file_exists(public_path("qrs/{$this->qr}"))) {
            return null;
        }
        return asset("qrs/{$this->qr}");
    }

    public function getStatusLabelAttribute()
    {
        return PaymentAccountStatus::label($this->status);
    }
}
