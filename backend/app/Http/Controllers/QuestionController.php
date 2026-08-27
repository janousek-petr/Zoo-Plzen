<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;
use Throwable;

class QuestionController extends Controller
{
    // Pomocná funkce pro vytažení ID z objektu nebo čísla
    private function extractMediaId($media) {
        if (is_array($media) && isset($media['id'])) {
            return $media['id'];
        }
        return is_numeric($media) ? $media : null;
    }
    public function store(Request $request, int $id)
    {
        // 1. Validace příchozích dat
        $validated = $request->validate([
            'text' => 'required|string',
            'points' => 'required|integer|min:1',
            'question_category' => 'required|exists:question_category,id',
            'image' => 'nullable',
            'audio' => 'nullable',
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'nullable|string',
            'answers.*.is_correct' => 'required|boolean',
            'answers.*.image' => 'nullable',
            'answers.*.audio' => 'nullable',
        ]);

        Quiz::findOrFail($id);

        // 2. Uložení do databáze v transakci
        return DB::transaction(function () use ($validated, $id) {
            // Vytvoření otázky
            $question = Question::create([
                'question_category' => $validated['question_category'],
                'text' => $validated['text'],
                'points' => $validated['points'],
                'image_id' => $this->extractMediaId($validated['image'] ?? null),
                'audio_id' => $this->extractMediaId($validated['audio'] ?? null),
            ]);

            DB::table('quiz_question')->insert(['question_id' => $question->id, 'quiz_id' => $id]);
            // Uložení odpovědí
            foreach ($validated['answers'] as $answerData) {
                $question->answers()->create([
                    'text' => $answerData['text'] ?? '',
                    'is_correct' => $answerData['is_correct'],
                    'image_id' => $this->extractMediaId($answerData['image'] ?? null),
                    'audio_id' => $this->extractMediaId($answerData['audio'] ?? null),
                ]);
            }

            // Vrácení vytvořené otázky včetně relací
            return response()->json(
                $question->load(['answers.image', 'answers.audio', 'image', 'audio', 'category']),
                201
            );
        });
    }

    public function show(int $quizId, int $questionId)
    {
        $question = Question::with([
            'category',
            'image',
            'audio',
            'answers',
            'answers.image',
            'answers.audio'
        ])
            ->whereHas('quizzes', function ($q) use ($quizId) {
                $q->where('quiz_id', $quizId);
            })
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
                    'image' => 'nullable',
                    'audio' => 'nullable',
                    'answers' => 'required|array|min:2',
                    'answers.*.id' => 'nullable|integer|exists:answer,id',
                    'answers.*.text' => 'nullable|string',
                    'answers.*.is_correct' => 'required|boolean',
                    'answers.*.image' => 'nullable',
                    'answers.*.audio' => 'nullable',
                ]);

                // Najde danou otázku
                $question = Question::whereHas('quizzes', fn($q) => $q->where('quiz_id', $quizId))
                    ->findOrFail($questionId);

                // Aktualizuje hodnoty otázky
                $question->update([
                    'text' => $validated['text'],
                    'points' => $validated['points'],
                    'question_category' => $validated['question_category'],
                    'image_id' => $this->extractMediaId($validated['image'] ?? null),
                    'audio_id' => $this->extractMediaId($validated['audio'] ?? null),
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
                        'image_id' => $this->extractMediaId($answer['image'] ?? null),
                        'audio_id' => $this->extractMediaId($answer['audio'] ?? null),
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
