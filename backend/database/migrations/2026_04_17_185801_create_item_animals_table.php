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
        Schema::create('item_animals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animal');
            $table->foreignId('item_id')->constrained('item');
            $table->unique(['animal_id', 'item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_animals');
    }
};
