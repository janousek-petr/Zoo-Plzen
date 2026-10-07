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
        Schema::create('challenge_template', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title');
            $table->string('code_pattern');
            $table->text('description');
            $table->enum('period', ['daily', 'weekly', 'both', 'custom'])->default('both');
            $table->integer('min_target');
            $table->integer('max_target');
            $table->integer('reward_paw')->nullable();
            $table->integer('reward_xp')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenge_template');
    }
};
