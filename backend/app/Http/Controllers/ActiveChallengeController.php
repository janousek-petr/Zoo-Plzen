<?php

namespace App\Http\Controllers;

use App\Models\ActiveChallenge;
use App\Models\ProfileChallengeProgress;
use Database\Factories\ChallengeEvaluatorFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ActiveChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $profileId = $request->input('profile_id');

        $weekly = ActiveChallenge::where('period', 'weekly')
            ->where('valid_until', '>', now())
            ->get();

        $daily = ActiveChallenge::where('period', 'daily')
            ->where('valid_until', '>', now())
            ->get();

        // ÚPRAVA: Výchozí stav je prázdná kolekce (pokrok bude u všeho 0)
        $progressMap = collect();

        // Pokud profile_id dorazil, načteme reálný pokrok z DB
        if ($profileId) {
            $activeIds = $weekly->pluck('id')->merge($daily->pluck('id'));

            $progressMap = ProfileChallengeProgress::where('profile_id', $profileId)
                ->whereIn('active_challenge_id', $activeIds)
                ->get()
                ->keyBy('active_challenge_id');
        }

        return response()->json([
            "weeklyChallenges" => $weekly->map(fn($c) => $this->formatWeeklyChallenge($c, $progressMap))->values(),
            "renewsInHours" => $this->calculateRenewHours($daily),
            "renewIconSrc" => "/img/icons/hourglass-icon.png",
            "renewIconAlt" => "Refresh",
            "dailyTasks" => $daily->values()->map(fn($c, $index) => $this->formatDailyTask($c, $index, $progressMap))->values()
        ]);
    }

    /**
     * Přijme event z frontendu a vyhodnotí výzvy
     */
    public function submitEvent(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $request->validate([
                    "challenge_type" => "required|string",
                ]);

                $active = ActiveChallenge::where('challenge_type', $request->challenge_type)
                    ->where('valid_until', '>', now())
                    ->get();

                foreach ($active as $challenge) {
                    $data = $challenge->data;
                    if (($data["challenge_type"] ?? null) !== $request->challenge_type) {
                        continue;
                    }
                    $evaluator = ChallengeEvaluatorFactory::make($data["challenge_type"]);
                    $evaluator->evaluate($challenge, $data, $request);
                }

                return response()->json(["status" => "ok"]);
            });
        } catch (\Throwable $th) {
            return response("Event failed: " . $th->getMessage(), 500);
        }
    }

    /**
     * Formátování pro rozhraní WeeklyChallenge
     */
    private function formatWeeklyChallenge(ActiveChallenge $challenge, $progressMap): array
    {
        $data = $challenge->data;

        // Vytáhneme progress objekt z mapy
        $userProgress = $progressMap[$challenge->id] ?? null;
        $progress = $userProgress ? $userProgress->progress : 0;

        // Výzva je splněná buď z DB vlaječky, nebo pokud progress dosáhl targetu
        $completed = $userProgress?->completed ?? ($progress >= ($data['target'] ?? 0));

        return [
            "id" => $challenge->id,
            "title" => $data["title"] ?? "",
            "description" => $data["description"] ?? "",
            "progress" => (int) $progress, // OPRAVA: vracíme reálné číslo progressu
            "reward" => $data["reward"] ?? 0,
            "rewardIconSrc" => $data["rewardIconSrc"] ?? "/img/icons/currency-icon.png",
            "rewardIconAlt" => $data["rewardIconAlt"] ?? "Tlapky",
            "animalSrc" => $data["animalSrc"] ?? "",
            "animalAlt" => $data["animalAlt"] ?? "No image found",
            "animalSide" => $data["animalSide"] ?? "left",
            "target" => $data["target"] ?? 0,
            "bgColor" => $data["bgColor"] ?? "#fff",
            "completed" => (bool) $completed,
        ];
    }

    /**
     * Formátování pro rozhraní DailyTask
     */
    private function formatDailyTask(ActiveChallenge $challenge, int $index, $progressMap): array
    {
        $data = $challenge->data;

        // Vytáhneme progress objekt z mapy
        $userProgress = $progressMap[$challenge->id] ?? null;
        $progress = $userProgress ? $userProgress->progress : 0;

        $completed = $userProgress?->completed ?? ($progress >= ($data['target'] ?? 0));

        return [
            "id" => $challenge->id,
            "order" => $index + 1,
            "orderIconSrc" => $data["orderIconSrc"] ?? "/icons/numbers/" . ($index + 1) . ".png",
            "orderIconAlt" => $data["orderIconAlt"] ?? "Krok " . ($index + 1),
            "title" => $data["title"] ?? "Obecné",
            "description" => $data["description"] ?? "",
            "progress" => (int) $progress,
            "reward" => $data["reward"] ?? 0,
            "rewardIconSrc" => $data["rewardIconSrc"] ?? "/img/icons/currency-icon.png",
            "rewardIconAlt" => $data["rewardIconAlt"] ?? "Tlapky",
            "target" => $data["target"] ?? 0,
            "bgColor" => "bg-[#5aab6e]",
            "rewardBgColor" => $completed ? "bg-[#5aab6e]" : "bg-[#f15a24]",
            "completed" => (bool) $completed,
        ];
    }

    private function calculateRenewHours($daily)
    {
        if ($daily->isEmpty()) {
            return 0;
        }

        return (int) now()->diffInHours($daily->first()->valid_until);
    }
}
