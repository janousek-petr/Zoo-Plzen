<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Quiz;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $quiz = Quiz::first();
        if (!$quiz) return;

        // 1. Vytvoříme otázku a získáme její ID
        // (Předpokládám, že question_category v tabulce question je ID kategorie)
        $questionId = DB::table('question')->insertGetId([
            'text' => 'Jaké zvíře je na obrázku?',
            'points' => 10,
            'question_category' => 1, // ID kategorie z tabulky question_category
            'image' => "/img/photo/image-1.jpg",
        ]);

        // 2. Propojíme otázku s kvízem v tabulce quiz_question
        DB::table('quiz_question')->insert([
            'quiz_id' => $quiz->id,
            'question_id' => $questionId,
        ]);

        // Přidáme druhou otázku pro jistotu
        $questionId2 = DB::table('question')->insertGetId([
            'text' => 'Jaké zvíře je na obrázku?',
            'points' => 20,
            'question_category' => 1,
            'image' => "/img/photo/image-2.jpg",
        ]);

        DB::table('quiz_question')->insert([
            'quiz_id' => $quiz->id,
            'question_id' => $questionId2,
        ]);
    }
}