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
        Schema::create('animal_taxa', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rank');
            $table->foreignId('id')->nullable()->constrained('animal_taxa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animal_taxa');
    }
};
