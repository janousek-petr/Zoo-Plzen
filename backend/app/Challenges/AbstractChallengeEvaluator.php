<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\AnsweredQuizzes;
use Illuminate\Http\Request;

class AbstractChallengeEvaluator implements ChallengeEvaluatorInterface
{

    public function evaluate(ActiveChallenge $challenge, array $data, Request $request): void
    {
        throw new \Exception("Method not implemented");
    }

    protected function getLatestAnsweredQuizId($quizId, $profileId): int
    {

        return AnsweredQuizzes::where('quiz_id', $quizId)
            ->where('profile_id', $profileId)
            ->latest('id')
            ->value('id');
    }

    protected function isTheSameRegion($answeredQuizId, $regionId): bool
    {
        return AnsweredQuizzes::where('id', $answeredQuizId)
            ->whereRelation('quiz', 'region_id', $regionId)
            ->exists();
    }
}
