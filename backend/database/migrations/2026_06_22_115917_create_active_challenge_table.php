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
        Schema::create('active_challenge', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->enum('period', ['daily', 'weekly']);
            $table->string('challenge_type');
            $table->json('data');                 // title, target, reward, region_id…
            $table->timestamp('valid_until');     // kdy výzva expiruje
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('active_challenge');
    }
};
