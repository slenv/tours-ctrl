<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationPayment extends Model
{
    protected $table = 'reservation_payments';

    protected $fillable = [
        'date',
        'payment_mean',
        'amount',
        'reservation_id',
        'payment_account_id',
        'user_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
