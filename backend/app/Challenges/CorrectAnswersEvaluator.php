<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\AnsweredQuestions;
use App\Models\AnsweredQuizzes;
use App\Models\Quiz;
use App\Models\ProfileChallengeProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CorrectAnswersEvaluator extends AbstractChallengeEvaluator
{

    public function evaluate(ActiveChallenge $challenge, array $data, Request $request): void
    {
        $profileId = $request->input('profile_id');
        // 2. Získání ID konkrétního pokusu (answered_quizzes.id)
        $answeredQuizId = $request->answered_quiz_id;

        // Pokud frontend neposlal přímo ID pokusu, najdeme nejnovější podle quiz_id
        if (!$answeredQuizId && $request->quiz_id) {
            $answeredQuizId = $this->getLatestAnsweredQuizId($profileId, $request->quiz_id);
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

        // Spočítáme správné uzavřené otázky (Multiple Choice & True/False)

        $correctClosed = $this->getTotalCorrectClosed($answeredQuizId);

        // Spočítáme správné otevřené otázky (Volný text)
        $correctOpen = $this->getTotalCorrectOpen($answeredQuizId);

        // Celkový počet správných odpovědí z tohoto pokusu
        $totalCorrect = $correctClosed + $correctOpen;

        if ($totalCorrect === 0) return;

        // 4. Přičtení k progresu a uložení zpracovaného pokusu
        $progress->progress += $totalCorrect;


        // 5. Kontrola, zda je výzva splněna
        if ($progress->progress >= $data["target"]) {
            $progress->progress = $data["target"]; // Zastropujeme progres na cíli (např. 7/7)
            $progress->completed = true;
            event(new ChallengeCompleted($progress));
        }

        $progress->save();
    }

    public static function getTotalCorrectClosed($answeredQuizId): int {
        return AnsweredQuestions::where('answered_quiz_id', $answeredQuizId)
            ->whereHas('chosenAnswer', function ($query) {
                $query->where('is_correct', true);
            })
            ->count();
    }
    public static function getTotalCorrectOpen(int $answeredQuizId): int
    {
        return AnsweredQuestions::where('answered_quiz_id', $answeredQuizId)
            ->whereNotNull('written_answer')
            ->whereHas('answers', function ($query) {
                $query->whereRaw('LOWER(TRIM(answered_questions.written_answer)) = LOWER(TRIM(answer.correct_input))');
            })
            ->count();
    }
}
