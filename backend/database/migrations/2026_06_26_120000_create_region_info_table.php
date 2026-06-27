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
        Schema::create('region_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained('region')->onDelete('cascade');
            $table->unsignedTinyInteger('level'); // 1 = základní info, 2 = další info, 3 = fun fact
            $table->text('text');
            $table->timestamps();

            $table->index(['region_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('region_info');
    }
};