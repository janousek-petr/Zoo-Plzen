<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\Region;
use Carbon\CarbonInterface;
use DB;
use Mockery\Exception;

class ChallengeGenerator
{
    /**
     * Uchovává již vygenerované výzvy pro kontrolu duplicit
     */
    private array $generated = [];

    /**
     * Vygeneruje denní výzvy
     */

    /**
     * Zkontroluje, zda je výzva duplicitní v rámci dne/týdne
     */
    private function isDuplicate(array $challenge): bool
    {
        foreach ($this->generated as $existing) {
            if (
                $existing['challenge_type'] === $challenge['challenge_type'] &&
                ($existing['region_id'] ?? null) === ($challenge['region_id'] ?? null) &&
                ($existing['target'] ?? null) === ($challenge['target'] ?? null)
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Uloží výzvu do seznamu vygenerovaných
     */
    private function remember(array $challenge): void
    {
        $this->generated[] = $challenge;
    }

    public function generateDaily(?int $count = null): void
    {
        $count = $count ?? config('challenges.daily_count', 3);
        $this->generateChallenges($count, now()->endOfDay(), "daily");
    }

    /**
     * Vygeneruje týdenní výzvy
     */
    public function generateWeekly(?int $count = null): void
    {
        $count = $count ?? config('challenges.weekly_count', 3);
        $this->generateChallenges($count, now()->addWeek(), "weekly");
    }


    private function generateChallenges(int $count, CarbonInterface $date, string $period): void
    {
        DB::transaction(function () use ($count, $date, $period) {
            $modifiers = config("challenges.{$period}");

            $regions = Region::all();

            for ($i = 0; $i < $count; $i++) {
                do {
                    $modifier = collect($modifiers)->random();
                    $baseTemplate = config("challenges.templates.{$modifier['templates']}");

                    $template = array_merge($baseTemplate, $modifier);
                    $randomTarget = rand($template['min'], $template['max']);
                    $template['target'] = $randomTarget;

                    $region = $regions->random();

                    $challenge = $this->buildChallenge($template, $region);

                    $challenge["animalSide"] = ($i % 2 === 0 && $period === "weekly") ? "left" : "right";
                } while ($this->isDuplicate($challenge));

                $this->remember($challenge);

                ActiveChallenge::create([
                    "period" => $period,
                    "challenge_type" => $challenge["challenge_type"],
                    "code" => $challenge["code"],
                    "data" => $challenge,
                    "valid_until" => $date,
                ]);
            }
        });


    }

    /**
     * Postaví jednu výzvu podle šablony a regionu
     */
    private function buildChallenge(array $template, $region): array
    {
        $type = $template["type"];

        return match ($type) {
            "region_correct_answers", "region_quiz_completed" => $this->buildRegionCorrectAnswersOrRegionQuizChallenge($template, $region),
            "correct_answers", "quiz_completed" => $this->buildCorrectAnswersOrQuizCompletedChallenge($template),
            default => throw new \Exception("Unknown challenge type: $type")
        };
    }

    /**
     * Šablona: správné odpovědi
     */
    private function buildRegionCorrectAnswersOrRegionQuizChallenge(array $template, $region): array
    {
        $count = rand($template["min"], $template["max"]);

        $code = str_replace(
            ["{count}", "{region_id}"],
            [$count, $region->id],
            $template["code_pattern"]) ?? '';

        $description = str_replace(
            ['{region}', '{count}'],
            [$region->name, $template['target']],
            $template['description'] ?? ''
        );

        return [
            "challenge_type" => $template["type"],
            "code" => $code,
            "title" => $template["title"] ?? "",
            "description" => $description,
            "target" => $count,
            "reward" => $count * 3,
            "region_id" => $region->id,
        ];
    }

    private function buildCorrectAnswersOrQuizCompletedChallenge(array $template): array
    {
        $count = rand($template["min"], $template["max"]);

        $code = str_replace(
            ["{count}"],
            [$count],
            $template["code_pattern"]) ?? '';

        $description = str_replace(
            ['{count}'],
            [$template['target']],
            $template['description'] ?? ''
        );

        return [
            "challenge_type" => $template["type"],
            "code" => $code,
            "title" => $template["title"] ?? "",
            "description" => $description,
            "target" => $count,
            "reward" => $count * 3,
        ];
    }
}
