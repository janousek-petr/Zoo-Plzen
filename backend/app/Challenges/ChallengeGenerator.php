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
     * Zkontroluje, zda je výzva duplicitní v rámci dne/týdne
     */
    private function isDuplicate(array $challenge, string $period): bool
    {
        // 1. PRAVIDLO: V rámci stejné dávky (např. jen v denních) se NESMÍ opakovat stejný TYP
        foreach ($this->generated as $existing) {
            if ($existing['challenge_type'] === $challenge['challenge_type']) {
                return true;
            }
        }

        // 2. PRAVIDLO: Mezi denními a týdenními typ stejný BÝT MŮŽE, ale nesmí být IDENTICKÝ
        // Ověříme v databázi vůči aktivním výzvám z JINÉHO období (period)
        $regionId = $challenge['region_id'] ?? null;
        $target = $challenge['target'] ?? null;

        $identicalExistsInDb = ActiveChallenge::where('challenge_type', $challenge['challenge_type'])
            ->where('period', '!=', $period)   // Kontrola vůči opačnému období (daily vs weekly)
            ->where('valid_until', '>', now()) // Pouze aktuálně platné/aktivní výzvy
            ->get()
            ->contains(function ($activeChallenge) use ($regionId, $target) {
                $dbData = $activeChallenge->data; // Předpokládáme array/json cast na modelu
                return ($dbData['region_id'] ?? null) === $regionId
                    && ($dbData['target'] ?? null) === $target;
            });

        if ($identicalExistsInDb) {
            return true; // Výzva se stejným typem, regionem i cílem už běží v druhém období
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

    /**
     * Vygeneruje denní výzvy
     */
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

    /**
     * Vygeneruje výzvy daného období
     * @param int $count Počet výzev, které se mají vytvořit
     * @param CarbonInterface $date Datum platnosti
     * @param string $period Období
     * @return void
     * @throws \Throwable
     */
    private function generateChallenges(int $count, CarbonInterface $date, string $period): void
    {
        DB::transaction(function () use ($count, $date, $period) {
            $modifiers = config("challenges.{$period}");

            $regions = Region::all();

            for ($i = 0; $i < $count; $i++) {
                do {
                    // Vybere náhodný modifikátor
                    $modifier = collect($modifiers)->random();
                    // Podle modifikátoru si sáhne pro základní šablonu
                    $baseTemplate = config("challenges.templates.{$modifier['templates']}");

                    // Spojí základní šablonu s modifikátorem do jednoho pole
                    $template = array_merge($baseTemplate, $modifier);

                    // Vygeneruje náhodný cíl (target) v rozmezí min a max z šablony
                    $randomTarget = rand($template['min'], $template['max']);
                    $template['target'] = $randomTarget;

                    $region = $regions->random();

                    // Sestaví finální strukturu dat výzvy (dosadí se texty, nahradí se zástupné znaky jako :target)
                    $challenge = $this->buildChallenge($template, $region);

                    // Pro týdenní výzvy přidá obrázek zvířete
                    if ($period === 'weekly') {
                        // Střídá stranu podle indexu
                        $side = ($i % 2 === 0) ? 'left' : 'right';

                        // Vytáhne z databáze obrázek zvířete pro tento region a stranu
                        $animalImage = DB::table('challenge_region_image')
                            ->where('region_id', $region->id)
                            ->where('side', $side)
                            ->inRandomOrder() // Pokud bys měl pro jednu stranu víc zvířat, vybere náhodné
                            ->first();

                        $challenge['animalSrc'] = $animalImage ? $animalImage->url : '';
                        $challenge['animalAlt'] = $animalImage ? $animalImage->alt : 'Zvíře';
                        $challenge['animalSide'] = $side;
                        $challenge['bgColor'] = $region->color;
                        $challenge['rewardIconSrc'] = '/img/icons/currency-icon.png';
                        $challenge['rewardIconAlt'] = 'Tlapky';

                        if ($animalImage?->title)
                            $challenge['title'] = $animalImage->title;
                    }
                } while ($this->isDuplicate($challenge, $period));

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
            "region_correct_answers", "region_quiz_completed" => $this->buildRegionalChallenge($template, $region),
            "correct_answers", "quiz_completed" => $this->buildGlobalChallenge($template),
            default => throw new \Exception("Unknown challenge type: $type")
        };
    }

    private function buildRegionalChallenge(array $template, $region): array
    {
        $count = $template['target'];

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
            "reward" => $template["reward"] * $template["target"],
            "region_id" => $region->id,
        ];
    }

    private function buildGlobalChallenge(array $template): array
    {
        $count = $template['target'];

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
            "reward" => $template["reward"] * $template["target"],
        ];
    }
}
