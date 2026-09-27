<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('challenge_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->nullable()->constrained('region')->nullOnDelete();
            $table->foreignId('media_id')->constrained('media');
            $table->string('title')->nullable();
            $table->string('alt')->default('Obrázek výzvy');
            $table->enum('side', ['left', 'right', 'both'])->default('right');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenge_image');
    }
};
