<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\ProfileChallengeProgress;
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
