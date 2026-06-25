<?php

namespace App\Http\Controllers;

use App\Challenges\ChallengeEvaluatorFactory;
use App\Models\ActiveChallenge;
use App\Models\UserChallengeProgress;
use DB;
use Illuminate\Http\Request;

class ActiveChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->input('userId');
        $weekly = ActiveChallenge::where('period', 'weekly')
            ->where('valid_until', '>', now())
            ->get();

        $daily = ActiveChallenge::where('period', 'daily')
            ->where('valid_until', '>', now())
            ->get();

        $activeIds = $weekly->pluck('id')->merge($daily->pluck('id'));
        $progressMap = UserChallengeProgress::where('user_id', $userId)
            ->whereIn('active_challenge_id', $activeIds)
            ->pluck('progress', 'active_challenge_id');

        return response()->json([
            "weeklyChallenges" => $weekly->map(fn($c) => $this->formatWeeklyChallenge($c, $progressMap))->values(),
            "renewsInHours" => $this->calculateRenewHours($daily),
            "renewIconSrc" => "/img/icons/hourglass-icon.png",
            "renewIconAlt" => "Refresh",
            "dailyTasks" => $daily->values()->map(fn($c, $index) => $this->formatDailyTask($c, $index))->values()
        ]);
    }

    /**
     * Přijme event z frontendu a vyhodnotí výzvy
     */
    public function submitEvent(Request $request)
    {
        DB::transaction(function () use ($request) {
            $request->validate([
                "challenge_type" => "required|string",
            ]);

            // Najdeme všechny aktivní výzvy tohoto typu
            $active = ActiveChallenge::where('challenge_type', $request->challenge_type)
                ->where('valid_until', '>', now())
                ->get();

            foreach ($active as $challenge) {
                $data = $challenge->data;
                if (($data["challenge_type"] ?? null) !== $request->challenge_type) {
                    continue;
                }
                // Vybereme správný evaluátor
                $evaluator = ChallengeEvaluatorFactory::make($data["challenge_type"]);

                // Vyhodnotíme výzvu
                $evaluator->evaluate($challenge, $data, $request);
            }

            return response()->json(["status" => "ok"]);
        });

        return response("Event failed");
    }
    /**
     * @deprecated
     * Formátování výzvy pro frontend
     *
     */
    private function formatChallenge(ActiveChallenge $challenge)
    {
        $data = $challenge->data;

        return [
            "id" => $challenge->id,
            "title" => $data["title"] ?? "",
            "description" => $data["description"] ?? "",
            "progress" => $this->getUserProgress($challenge->id),
            "reward" => $data["reward"] ?? 0,
            "rewardIconSrc" => $data["rewardIconSrc"] ?? "img/icons/currency-icon.png",
            "rewardIconAlt" => $data["rewardIconAlt"] ?? "Tlapky",
            "animalSrc" => $data["animalSrc"] ?? "",
            "animalAlt" => $data["animalAlt"] ?? "No image found",
            "animalSide" => $data["animalSide"] ?? "left",
            "bgColor" => $data["bgColor"] ?? "#fff",
            "textColor" => $data["textColor"] ?? "#000",
        ];
    }

    /**
     * Formátování pro rozhraní WeeklyChallenge
     */
    private function formatWeeklyChallenge(ActiveChallenge $challenge, $progressMap): array
    {
        $data = $challenge->data;

        return [
            "id" => $challenge->id,
            "title" => $data["title"] ?? "",
            "description" => $data["description"] ?? "",
            "progress" => $progressMap[$challenge->id] ?? 0,
            "reward" => $data["reward"] ?? 0,
            "rewardIconSrc" => $data["rewardIconSrc"] ?? "img/icons/currency-icon.png",
            "rewardIconAlt" => $data["rewardIconAlt"] ?? "Tlapky",
            "animalSrc" => $data["animalSrc"] ?? "",
            "animalAlt" => $data["animalAlt"] ?? "No image found",
            "animalSide" => $data["animalSide"] ?? "left",
            "bgColor" => $data["bgColor"] ?? "#fff",
            "textColor" => $data["textColor"] ?? "#000",
        ];
    }

    /**
     * Formátování pro rozhraní DailyTask
     */
    private function formatDailyTask(ActiveChallenge $challenge, int $index): array
    {
        $data = $challenge->data;

        return [
            "id" => $challenge->id,
            "order" => $index + 1, // Automatické pořadí od 1 podle indexu v kolekci
            "orderIconSrc" => $data["orderIconSrc"] ?? "/icons/numbers/" . ($index + 1) . ".png",
            "orderIconAlt" => $data["orderIconAlt"] ?? "Krok " . ($index + 1),
            "category" => $data["category"] ?? "Obecné",
            "description" => $data["description"] ?? "",
            "progress" => $progressMap[$challenge->id] ?? 0,
            "reward" => $data["reward"] ?? 0,
            "rewardIconSrc" => $data["rewardIconSrc"] ?? "img/icons/currency-icon.png",
            "rewardIconAlt" => $data["rewardIconAlt"] ?? "Tlapky",
            "bgColor" => $data["bgColor"] ?? "#fff",
            "rewardBgColor" => $data["rewardBgColor"] ?? "#eee",
        ];
    }
    /**
     * Získá progres hráče pro danou výzvu
     */
    private function getUserProgress($activeChallengeId, int $userId)
    {
        return UserChallengeProgress::where('user_id', $userId)
            ->where('active_challenge_id', $activeChallengeId)
            ->value('progress') ?? 0;
    }

    /**
     * Spočítá, za kolik hodin se výzvy obnoví
     */
    private function calculateRenewHours($daily)
    {
        if ($daily->isEmpty()) {
            return 0;
        }

        return now()->diffInHours($daily->first()->valid_until);
    }
}
