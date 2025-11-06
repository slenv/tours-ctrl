<?php

use App\Enums\PaymentMean;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_payments', function (Blueprint $table) {
            $table->id();
            $table->timestampTz('date')->useCurrent();
            $table->enum('payment_mean', PaymentMean::values())->default(PaymentMean::CASH->value);
            $table->decimal('amount', 10, 2);
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('restrict');
            $table->foreignId('payment_account_id')->nullable()->constrained('payment_accounts')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_payments');
    }
};
