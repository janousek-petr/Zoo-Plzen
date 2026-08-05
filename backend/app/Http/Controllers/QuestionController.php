<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;
use Throwable;

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
        try {
            DB::transaction(function () use ($request, $questionId, $quizId) {
                $validated = $request->validate([
                    'text' => 'required|string',
                    'points' => 'required|integer|min:1',
                    'question_category' => 'required|integer|exists:question_category,id',
                    'image' => 'nullable|string',
                    'answers' => 'required|array|min:2',
                    'answers.*.id' => 'nullable|integer|exists:answer,id',
                    'answers.*.text' => 'nullable|string',
                    'answers.*.is_correct' => 'required|boolean',
                    'answers.*.image' => 'nullable|string',
                ]);

                // Najde danou otázku
                $question = Question::whereHas('quizzes', fn($q) => $q->where('quiz_id', $quizId))
                    ->findOrFail($questionId);

                // Aktualizuje hodnoty otázky
                $question->update([
                    'text' => $validated['text'],
                    'points' => $validated['points'],
                    'question_category' => $validated['question_category'],
                    'image' => $validated['image'] ?? null,
                ]);

                // Sebere ID odpovědí, které přišly z frontendu
                $keptAnswerIds = collect($validated['answers'])
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                // Smaže všechny odpovědi, které se nenacházejí v poli keptAnswerIds
                $question->answers()->whereNotIn('id', $keptAnswerIds)->delete();

                // Pro každou odpověď aktualizuje hodnoty. Pokud neexistuje, vytvoří nový záznam.
                foreach ($validated['answers'] as $answer) {
                    $answerData = ([
                        'text' => $answer['text'] ?? null,
                        'is_correct' => $answer['is_correct'],
                        'image' => $answer['image'] ?? null,
                        'question_id' => $question->id,
                    ]);

                    if (!empty($answer['id'])) {
                        // Aktualizuje stávající odpověď
                        Answer::where('id', $answer['id'])->update($answerData);
                    } else {
                        // Odpověď nemá ID, tak vytvoří novou
                        Answer::create($answerData);
                    }
                }

                return response()->json($question->load(['answers', 'category']));
            });
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $th) {
            return response()->json([
                'message' => 'Při ukládání otázky došlo k chybě v databázi.',
                'error' => config('app.debug') ? $th->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function destroy(int $quizId, int $questionId)
    {
        $question = Question::whereHas('quizzes', fn($q) => $q->where('quiz_id', $quizId))
            ->findOrFail($questionId);

        DB::table('answer')->where('question_id', $questionId)->delete();
        DB::table('quiz_question')->where('question_id', $questionId)->delete();
        DB::table('question')->where('id', $questionId)->delete();

        return response()->noContent();
    }
}
