<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $question = Question::create([
            'text' => $request->text,
            'image' => $request->image,
            'question_category' => $request->question_category,
            'points' => $request->points,
        ]);

        $question->quizzes()->attach($request->quiz_id);

        foreach ($request->answers as $answer) {
            $question->answers()->create(
                [
                    'text' => $answer['text'] ?? null,
                    'is_correct' => $answer['is_correct'] ?? 0,
                    'correct_input' => $answer['correct_input'] ?? null,
                    'image' => $answer['image'] ?? null,
                ]);
        }

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $questions = Question::where('quiz_id', $id)->get();

        return response()->json($questions);
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
    public function update(Request $request, int $id)
    {
        //
        $question = Question::findOrFail($id);

        $question->update([
            'text' => $request->text,
            'image' => $request->image ?? null,
            'question_category' => $request->question_category,
            'points' => $request->points,
        ]);

        $question->answers()->delete();

        foreach ($request->answers as $answer) {
            $question->answers()->create([
                'text' => $answer['text'] ?? null,
                'is_correct' => $answer['is_correct'] ?? 0,
                'correct_input' => $answer['correct_input'] ?? null,
                'image' => $answer['image'] ?? null,
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
        Question::where('id', $id)->delete();

        return response()->noContent();
    }
}
