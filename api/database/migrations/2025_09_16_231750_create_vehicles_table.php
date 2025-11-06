<?php

use App\Enums\VehicleStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate', 6)->unique();
            $table->string('color', 100);
            $table->tinyInteger('seats');
            $table->string('brand', 150);
            $table->string('model', 150);
            $table->string('owner')->nullable(); // null si es de la empresa
            $table->enum('status', VehicleStatus::values())->default(VehicleStatus::ACTIVE->value);
            $table->timestamps();
            $table->softDeletes();

            $table->index('plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
