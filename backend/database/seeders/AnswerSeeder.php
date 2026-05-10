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
        if ($questions->count() < 4) {
            $this->command->warn('Nenalezeny dostatečné otázky.');
            return;
        }

        // Odpovědi pro select (q1)
        DB::table('answer')->insert([
            ['question_id' => $questions[0]->id, 'text' => 'Slon africký', 'is_correct' => 1, 'image' => null, 'correct_input' => null],
            ['question_id' => $questions[0]->id, 'text' => 'Hroch', 'is_correct' => 0, 'image' => null, 'correct_input' => null],
            ['question_id' => $questions[0]->id, 'text' => 'Nosorožec', 'is_correct' => 0, 'image' => null, 'correct_input' => null],
        ]);

        // Odpovědi pro select s obrázkem (q2)
        DB::table('answer')->insert([
            ['question_id' => $questions[1]->id, 'text' => 'Žirafa', 'is_correct' => 1, 'image' => null, 'correct_input' => null],
            ['question_id' => $questions[1]->id, 'text' => 'Zebra', 'is_correct' => 0, 'image' => null, 'correct_input' => null],
            ['question_id' => $questions[1]->id, 'text' => 'Antilopa', 'is_correct' => 0, 'image' => null, 'correct_input' => null],
        ]);

        // Odpovědi pro true_false (q3)
        DB::table('answer')->insert([
            ['question_id' => $questions[2]->id, 'text' => 'Ano', 'is_correct' => 0, 'image' => null, 'correct_input' => null],
            ['question_id' => $questions[2]->id, 'text' => 'Ne', 'is_correct' => 1, 'image' => null, 'correct_input' => null],
        ]);

    }
}