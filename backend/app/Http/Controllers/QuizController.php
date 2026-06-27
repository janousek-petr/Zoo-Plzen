<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizQuestionView;
use App\Models\QuizSummary;
use App\Models\AnsweredQuizzes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        // $quizzes = QuizSummary::all();
        $tmp = Quiz::with(['region'])->get();

        return response()->json($tmp);
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
            'name' => 'required|string',
            'description' => 'nullable|string',
            'region_id' => 'integer|exists:region,id',
            'level' => 'required|integer|min:1|max:3',
        ]);

        $quiz = Quiz::create($validated);

        return response()->json($quiz);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {


        /*$questions = Question::with(['answers', 'category'])
            ->whereHas('quizzes', fn ($q) => $q->where('quiz_id', $id))
            ->get();

        return response()->json($questions);*/

        $quiz = Quiz::with('region')->where('id', $id)->first();

        return response()->json($quiz);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        //
        $quizInfo = Quiz::where('id', $id)->first();

        return response()->json($quizInfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        //
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'region_id' => 'required',
            'level' => 'required|integer|min:1|max:3',
            'is_published' => 'boolean',
        ]);

        DB::table('quiz')->where('id', $id)->update($validated);

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $questionIds = DB::table('quiz_question')
            ->where('quiz_id', $id)
            ->pluck('question_id');

        DB::table('answer')->whereIn('question_id', $questionIds)->delete();
        DB::table('question')->whereIn('id', $questionIds)->delete();
        DB::table('quiz')->where('id', $id)->delete();

        return response()->noContent();
    }

    private function getUnlockedLevels(int $profileId, int $regionId): array
    {
        $POINTS_TO_UNLOCK = 50;
        $unlocked = [1];

        foreach ([2, 3] as $level) {
            $points = AnsweredQuizzes::join('quiz', 'answered_quizzes.quiz_id', '=', 'quiz.id')
                ->where('answered_quizzes.profile_id', $profileId)
                ->where('quiz.region_id', $regionId)
                ->where('quiz.level', $level - 1)
                ->sum('answered_quizzes.score');

            if ($points >= $POINTS_TO_UNLOCK) {
                $unlocked[] = $level;
            } else {
                break;
            }
        }

        return $unlocked;
    }

    public function byRegion(int $id, Request $request)
    {
        $quizzes = Quiz::where('region_id', $id)
            ->where('is_published', true)
            ->orderBy('level')
            ->get();

        $profileId = $request->query('profile_id');

        $regionScore = $profileId
            ? AnsweredQuizzes::join('quiz', 'answered_quizzes.quiz_id', '=', 'quiz.id')
                ->where('answered_quizzes.profile_id', (int)$profileId)
                ->where('quiz.region_id', $id)  // <-- filtruj podle regionu!
                ->sum('answered_quizzes.score')
            : 0;

        return response()->json([
            'quizzes' => $quizzes,
            'region_score' => $regionScore,
        ]);
    }

    public function questions($id){
        $questions = Question::with(['answers', 'category'])
            ->whereHas('quizzes', fn ($q) => $q->where('quiz_id', $id))
            ->get();

        return response()->json($questions);
    }

    public function togglePublish(int $id)
    {
        $quiz = Quiz::findOrFail($id);

        if (!$quiz->is_published) {
            $hasQuestions = DB::table('quiz_question')
                ->where('quiz_id', $id)
                ->exists();

            if (!$hasQuestions) {
                return response()->json(
                    ['message' => 'Kvíz musí mít alespoň jednu otázku.'],
                    422
                );
            }
        }

        $quiz->update(['is_published' => !$quiz->is_published]);

        return response()->json(['is_published' => $quiz->is_published]);
    }

    public function startRandom(Request $request)
    {
        $validated = $request->validate([
            'region_id' => 'required|integer|exists:region,id',
            'level'     => 'required|integer|min:1|max:3',
        ]);

        $quiz = Quiz::where('region_id', $validated['region_id'])
                    ->where('level', $validated['level'])
                    ->where('is_published', true)
                    ->inRandomOrder()
                    ->firstOrFail();

        $questions = Question::with(['answers', 'category'])
            ->whereHas('quizzes', fn($q) => $q->where('quiz_id', $quiz->id))
            ->get();

        return response()->json([
            'quiz_meta' => $quiz->load('region'),
            'questions' => $questions,
        ]);
    }

}


