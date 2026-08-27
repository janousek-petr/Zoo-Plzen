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
        Schema::create('question', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->foreignId('image_id')->nullable()->constrained('media');
            $table->foreignId('audio_id')->nullable()->constrained('media');
            $table->foreignId('question_category')->constrained('question_category');
            $table->integer('points')->default(2);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question');
    }
};
