<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizQuestionView;
use App\Models\QuizSummary;
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
        //
        $validatedData = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'region_id' => 'required',
        ]);

        Quiz::create([
            'name' => $request->name,
            'description' => $request->description,
            'region_id' => $request->region_id,
        ]);

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
        /*
        $questions = QuizQuestionView::where('quiz_id', $id)->inRandomOrder()->get();
        $questionsId = $questions->pluck('question_id');
        $answers = Answer::whereIn('question_id', $questionsId)->inRandomOrder()->get();

        $groupedAnswers = $answers->groupBy('question_id');
        $questions->each(function ($q) use ($groupedAnswers) {
            $q->answers = $groupedAnswers[$q->question_id] ?? [];
        });

        return response()->json($questions);
        */

        $questions = Question::with(['answers', 'category'])
            ->whereHas('quizzes', fn ($q) => $q->where('quiz_id', $id))
            ->get();

        return response()->json($questions);
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
        ]);

        DB::table('quiz')->where('id', $id)->update($validated);

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
        DB::table('quiz')->where('id', $id)->delete();

        return response()->noContent();
    }
}
