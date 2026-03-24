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
        Schema::create('answer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('question');
            $table->string('text')->nullable()->default(null);
            $table->string('correct_input')->nullable()->default(null);
            $table->boolean('is_correct')->default(false);
            $table->string('image')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_answer');
    }
};
