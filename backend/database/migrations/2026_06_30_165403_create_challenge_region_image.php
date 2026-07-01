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
        Schema::create('challenge_region_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained('region');
            $table->string('url');
            $table->string('title')->nullable();
            $table->string('alt');
            $table->enum('side', ['left', 'right']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenge_region_image');
    }
};
