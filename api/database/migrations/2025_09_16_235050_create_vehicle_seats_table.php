<?php

use App\Enums\VehicleSeatStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_seats', function (Blueprint $table) {
            $table->id();
            $table->string('label', 30);
            $table->tinyInteger('row');
            $table->tinyInteger('rowspan');
            $table->tinyInteger('col');
            $table->tinyInteger('colspan');
            $table->enum('status', VehicleSeatStatus::values())->default(VehicleSeatStatus::ACTIVE->value);
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_seats');
    }
};
