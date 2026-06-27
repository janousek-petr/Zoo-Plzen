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
        //
        Schema::create('answered_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('answered_quiz_id')->constrained('answered_quizzes');
            $table->foreignId('question_id')->constrained('question');
            $table->foreignId('chosen_answer')->nullable()->constrained('answer');
            $table->string('written_answer')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('answered_questions');
    }
};
