<?php

namespace App\Http\Controllers;

use App\Models\AnsweredQuizzes;
use App\Models\Profile;
use Illuminate\Http\Request;

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
        ]);

        // Bezpečnostní kontrola: profil musí patřit přihlášenému userovi.
        // Bez tohle by si kdokoliv mohl přes API zapsat výsledek k cizímu profilu.
        $profile = Profile::where('id', $validated['profile_id'])
            ->where('user_id', auth()->id())
            ->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil nenalezen nebo nepatří k tomuto účtu.'], 403);
        }

        $answeredQuiz = AnsweredQuizzes::create([
            'quiz_id' => $validated['quiz_id'],
            'profile_id' => $validated['profile_id'],
            'score' => $validated['score'],
            'answered_at' => now(),
        ]);

        return response()->json($answeredQuiz, 201);
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