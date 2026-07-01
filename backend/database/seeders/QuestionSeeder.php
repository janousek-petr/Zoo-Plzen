<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Quiz;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $quiz = Quiz::where('level', 1)->first();
        if (!$quiz) return;

        // === select — klasický výběr z textu ===
        $q1 = DB::table('question')->insertGetId([
            'text' => 'Jaké zvíře je největší suchozemský savec?',
            'points' => 10,
            'question_category' => 2, // select
            'image' => null,
        ]);
        DB::table('quiz_question')->insert(['quiz_id' => $quiz->id, 'question_id' => $q1]);

        // === select s obrázkem otázky ===
        $q2 = DB::table('question')->insertGetId([
            'text' => 'Jaké zvíře má dlouhý krk?',
            'points' => 10,
            'question_category' => 2, // select
            'image' => null,
        ]);
        DB::table('quiz_question')->insert(['quiz_id' => $quiz->id, 'question_id' => $q2]);

        // === true_false ===
        $q3 = DB::table('question')->insertGetId([
            'text' => 'Je žirafa největší zvíře na světě?',
            'points' => 10,
            'question_category' => 1, // true_false
            'image' => null,
        ]);
        DB::table('quiz_question')->insert(['quiz_id' => $quiz->id, 'question_id' => $q3]);

        
    }
}