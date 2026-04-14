<?php

namespace App\Http\Controllers;

use App\Models\AnsweredQuestion;
use App\Models\AnsweredQuizzes;
use Illuminate\Http\Request;

class AnsweredQuizzesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $id)
    {
        //
        $quizzes = AnsweredQuizzes::where('user_id', $id)->with(['quiz'])->get();

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
    public function show(string $id)
    {
        //
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
