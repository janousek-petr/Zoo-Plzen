<?php

namespace App\Challenges;
use App\Models\ActiveChallenge;
use Illuminate\Http\Request;

interface ChallengeEvaluatorInterface
{
    public function evaluate(ActiveChallenge $challenge, array $data, Request $request): void;
}
