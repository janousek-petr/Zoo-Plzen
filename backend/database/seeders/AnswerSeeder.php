<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Question;

class AnswerSeeder extends Seeder
{
    public function run(): void
    {
        $questions = Question::orderBy('id')->get();

        if ($questions->count() < 2) {
            $this->command->warn('Nenalezeny dostatečné otázky. Spusť nejdřív QuestionSeeder.');
            return;
        }

        // Odpovědi pro otázku 1 (image-1.jpg)
        DB::table('answer')->insert([
            [
                'question_id' => $questions[0]->id,
                'text' => 'Tygr',
                'correct_input' => null,
                'is_correct' => 1,
                'image' => null,
            ],
            [
                'question_id' => $questions[0]->id,
                'text' => 'Lev',
                'correct_input' => null,
                'is_correct' => 0,
                'image' => null,
            ],
            [
                'question_id' => $questions[0]->id,
                'text' => 'Gepard',
                'correct_input' => null,
                'is_correct' => 0,
                'image' => null,
            ],
        ]);

        // Odpovědi pro otázku 2 (image-2.jpg)
        DB::table('answer')->insert([
            [
                'question_id' => $questions[1]->id,
                'text' => 'Lev',
                'correct_input' => null,
                'is_correct' => 1,
                'image' => null,
            ],
            [
                'question_id' => $questions[1]->id,
                'text' => 'Tygr',
                'correct_input' => null,
                'is_correct' => 0,
                'image' => null,
            ],
            [
                'question_id' => $questions[1]->id,
                'text' => 'Gepard',
                'correct_input' => null,
                'is_correct' => 0,
                'image' => null,
            ],
        ]);
    }
}