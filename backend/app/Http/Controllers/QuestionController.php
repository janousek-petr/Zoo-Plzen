<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function store(Request $request, int $id)
    {
        $validated = $request->validate([
            'text' => 'required|string',
            'points' => 'required|integer|min:1',
            'question_category' => 'required|integer|exists:question_category,id',
            'image' => 'nullable|string',
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'nullable|string',
            'answers.*.is_correct' => 'required|boolean',
            'answers.*.image' => 'nullable|string',
        ]);

        $question = Question::create([
            'text' => $validated['text'],
            'points' => $validated['points'],
            'question_category' => $validated['question_category'],
            'image' => $validated['image'] ?? null,
        ]);

        // Připojit k quizu
        DB::table('quiz_question')->insert([
            'quiz_id' => $id,
            'question_id' => $question->id,
        ]);

        // Vytvořit odpovědi
        foreach ($validated['answers'] as $answer) {
            Answer::create([
                'text' => $answer['text'] ?? null,
                'is_correct' => $answer['is_correct'],
                'image' => $answer['image'] ?? null,
                'question_id' => $question->id,
            ]);
        }

        return response()->json($question->load(['answers', 'category']), 201);
    }

    public function show(int $quizId, int $questionId)
{
    $question = Question::with(['answers', 'category'])
        ->whereHas('quizzes', fn($q) => $q->where('quiz_id', $quizId))
        ->findOrFail($questionId);

    return response()->json($question);
}

public function update(Request $request, int $quizId, int $questionId)
{
    $validated = $request->validate([
        'text' => 'required|string',
        'points' => 'required|integer|min:1',
        'question_category' => 'required|integer|exists:question_category,id',
        'image' => 'nullable|string',
        'answers' => 'required|array|min:2',
        'answers.*.text' => 'nullable|string',
        'answers.*.is_correct' => 'required|boolean',
        'answers.*.image' => 'nullable|string',
    ]);

    $question = Question::whereHas('quizzes', fn($q) => $q->where('quiz_id', $quizId))
        ->findOrFail($questionId);

    $question->update([
        'text' => $validated['text'],
        'points' => $validated['points'],
        'question_category' => $validated['question_category'],
        'image' => $validated['image'] ?? null,
    ]);

    // Smazat staré a vytvořit nové odpovědi
    $question->answers()->delete();
    foreach ($validated['answers'] as $answer) {
        Answer::create([
            'text' => $answer['text'] ?? null,
            'is_correct' => $answer['is_correct'],
            'image' => $answer['image'] ?? null,
            'question_id' => $question->id,
        ]);
    }

    return response()->json($question->load(['answers', 'category']));
}
}