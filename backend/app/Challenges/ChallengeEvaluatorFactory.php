<?php

namespace App\Challenges;

class ChallengeEvaluatorFactory
{
    public static function make(string $type): AbstractChallengeEvaluator
    {
        return match ($type) {
            "correct_answers","region_correct_answers" => new CorrectAnswersEvaluator(),
            "quiz_completed", "region_quiz_completed" => new QuizCompletedEvaluator(),
            default => throw new \Exception("Unknown challenge type: $type")
        };
    }
}


