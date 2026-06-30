<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\ProfileChallengeProgress;
use App\Models\Quiz;
use Illuminate\Http\Request;
class QuizCompletedEvaluator extends AbstractChallengeEvaluator
{

    public function evaluate(ActiveChallenge $challenge, array $data, Request $request): void
    {
        $profileId = $request->input('profile_id');
        // 2. Získání ID konkrétního pokusu (answered_quizzes.id)
        $answeredQuizId = $request->answered_quiz_id;

        // Pokud frontend neposlal přímo ID pokusu, najdeme nejnovější podle quiz_id
        if (!$answeredQuizId && $request->quiz_id) {
            $answeredQuizId = $this->getLatestAnsweredQuizId($request->quiz_id, $profileId);
        }

        if (!$answeredQuizId) return;

        if (!empty($data['region_id'])) {
            if (!$this->isTheSameRegion($answeredQuizId, $data['region_id'])) return;
        }

        // Pro splnění podmínky musí počet správných odpovědí být 80% nebo víc
        $correctClosed = CorrectAnswersEvaluator::getTotalCorrectClosed($answeredQuizId);
        $correctOpen = CorrectAnswersEvaluator::getTotalCorrectOpen($answeredQuizId);
        $totalCorrect = $correctClosed + $correctOpen;

        $quiz = Quiz::find($request->quiz_id);

        $totalQuestions = $quiz->questions()->count();
        if (!$quiz || $totalQuestions === 0) return;

        $percentage = ($totalCorrect / $totalQuestions) * 100;
        if ($percentage < 80) return;

        // 3. Načteme nebo vytvoříme celkový pokrok uživatele v této výzvě
        $progress = ProfileChallengeProgress::firstOrCreate([
            "profile_id" => $profileId,
            "active_challenge_id" => $challenge->id
        ]);

        if ($progress->completed) return;

        $progress->progress += 1;

        // 5. Kontrola, zda je výzva splněna
        if ($progress->progress >= $data["target"]) {
            $progress->progress = $data["target"]; // Zastropujeme progres na cíli (např. 7/7)
            $progress->completed = true;
            event(new ChallengeCompleted($progress));
        }

        $progress->save();

        if ($progress->completed) return;
    }
}
