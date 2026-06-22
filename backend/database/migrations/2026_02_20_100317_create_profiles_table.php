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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('nickname')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('accessory_url')->nullable();
            $table->string('wallpaper_url')->nullable();
            $table->json('displayed_medals')->nullable();
            $table->unsignedBigInteger('avatar_item_id')->nullable();
            $table->unsignedBigInteger('accessory_item_id')->nullable();
            $table->unsignedBigInteger('wallpaper_item_id')->nullable();
            $table->integer('level')->default(1);
            $table->integer('xp')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
