<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\AnsweredQuestions;
use App\Models\AnsweredQuizzes;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnsweredQuizzesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();
        $quizzes = AnsweredQuizzes::whereHas('profile', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->with(['quiz'])->get();

        return response()->json($quizzes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|integer|exists:quiz,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'score' => 'required|integer|min:0',
            'selectedAnswers' => 'required|array'
        ]);

        $profileExists = Profile::where('id', $validated['profile_id'])->exists();

        if ($profileExists) {
            $answeredQuiz = DB::transaction(function () use ($validated,) {
                $answeredQuiz = AnsweredQuizzes::create([
                    'quiz_id' => $validated['quiz_id'],
                    'score' => $validated['score'],
                    'profile_id' => $validated['profile_id'],
                ]);
                $chosenAnswerIds = $validated['selectedAnswers'];

                $answers = Answer::whereIn('id', $chosenAnswerIds)->get();

                $answeredQuestionsData = [];

                foreach ($answers as $answer) {
                    $answeredQuestionsData[] = [
                        'answered_quiz_id' => $answeredQuiz->id,
                        'question_id' => $answer->question_id,
                        'chosen_answer' => $answer->id,
                        'written_answer' => null,
                    ];
                }

                if (!empty($answeredQuestionsData)) {
                    AnsweredQuestions::insert($answeredQuestionsData);
                }

                return $answeredQuiz;
            });
            return response()->json($answeredQuiz, 201);
        }

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $answeredQuiz = AnsweredQuizzes::with([
            'answeredQuestions.question.answers',
        ])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($answeredQuiz);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
