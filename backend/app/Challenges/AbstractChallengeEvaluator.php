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

    /**
     * Najde ID nejnovějšího vypracovaného kvízu profilu
     * @param int $quizId ID kvízu
     * @param int $profileId ID profilu
     * @return int
     */
    protected function getLatestAnsweredQuizId($quizId, $profileId): int
    {

        return AnsweredQuizzes::where('quiz_id', $quizId)
            ->where('profile_id', $profileId)
            ->latest('id')
            ->value('id');
    }

    /**
     * Porovná, pokud vypracovaný kvíz patří do zadané oblasti
     * @param int $answeredQuizId ID vypracovaného kvízu
     * @param int $regionId ID oblasti
     * @return bool
     */
    protected function isTheSameRegion($answeredQuizId, $regionId): bool
    {
        return AnsweredQuizzes::where('id', $answeredQuizId)
            ->whereRelation('quiz', 'region_id', $regionId)
            ->exists();
    }
}
