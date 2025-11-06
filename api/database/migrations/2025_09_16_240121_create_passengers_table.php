<?php

use App\Enums\DocType;
use App\Enums\Gender;
use App\Enums\PassengerStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('passengers', function (Blueprint $table) {
            $table->id();
            $table->enum('doc_type_code', [DocType::DNI->value, DocType::CE->value]);
            $table->string('doc_number', 20)->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('phone')->nullable();
            $table->date('birthdate')->nullable();
            $table->enum('gender', Gender::values())->default(Gender::UNKNOWN->value);
            $table->enum('status', PassengerStatus::values())->default(PassengerStatus::ACTIVE->value);
            $table->char('country_code', 2);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passengers');
    }
};
