<?php

namespace App\Http\Controllers;

use App\Models\AnsweredQuizzes;
use Illuminate\Http\Request;

class AnsweredQuizzesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user_id = auth()->id();
        $quizzes = AnsweredQuizzes::where('user_id', $user_id)->with(['quiz'])->get();

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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
        $answeredQuiz = AnsweredQuizzes::with([
            'answeredQuestions.question.answers',  // vyplněné otázky → otázka
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
