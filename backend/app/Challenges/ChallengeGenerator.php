<?php

namespace App\Challenges;

use App\Models\ActiveChallenge;
use App\Models\ChallengeImage;
use App\Models\ChallengeTemplate;
use App\Models\Region;
use Carbon\CarbonInterface;
use DB;
use Illuminate\Support\Carbon;

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
    public function generateDaily(?int $count = null, ?string $valid_until = null): void
    {
        $count = $count ?? config('challenges.daily_count', 3);
        $valid_until = $valid_until ? Carbon::parse($valid_until) : now()->endOfDay();
        $this->generateChallenges($count, Carbon::parse($valid_until), "daily");
    }

    /**
     * Vygeneruje týdenní výzvy
     */
    public function generateWeekly(?int $count = null, ?string $valid_until = null): void
    {
        $count = $count ?? config('challenges.weekly_count', 3);
        $valid_until = $valid_until ? Carbon::parse($valid_until)->endOfDay() : now()->addWeek();
        $this->generateChallenges($count, Carbon::parse($valid_until), "weekly");
    }

    /**
        * Vygeneruje výzvy daného období
        * @param int $count Počet výzev, které se mají vytvořit
        * @param CarbonInterface $date Datum platnosti
        * @param string $period Období (daily/weekly)
        * @return void
        * @throws \Exception
    */
    private function generateChallenges(int $count, CarbonInterface $date, string $period): void
    {
        DB::transaction(function () use ($count, $date, $period) {
            // Načteme dostupné šablony z DB
            $modifiers = ChallengeTemplate::whereIn('period', [$period, "both"])
                ->where('is_active', true) // Pouze aktivní
                ->get();

            $regions = Region::all();

            // Kontrola, zda máme v DB z čeho generovat
            if ($modifiers->isEmpty()) {
                throw new \Exception("V databázi nebyly nalezeny žádné šablony výzev pro období: '{$period}'.");
            }

            if ($regions->isEmpty()) {
                throw new \Exception("V databázi nebyly nalezeny žádné regiony.");
            }

            for ($i = 0; $i < $count; $i++) {
                do {
                    // Vybere náhodnou šablonu z DB
                    /** @var ChallengeTemplate $templateModel */
                    $templateModel = $modifiers->random();

                    // Převedeme model na pole pro další zpracování
                    $template = $templateModel->toArray();

                    // Vygeneruje náhodný cíl (target) z min_target a max_target šablony
                    $min = $template['min_target'] ?? 1;
                    $max = $template['max_target'] ?? 10;
                    $template['target'] = rand($min, $max);

                    // Přejmenování fieldů z DB pro potřeby evaluatorů, pokud se liší
                    $template['type'] = $templateModel->type;
                    $template['reward'] = $templateModel->reward_paw ?? $templateModel->reward ?? 5;

                    $region = $regions->random();

                    // Sestaví finální strukturu dat výzvy
                    $challenge = $this->buildChallenge($template, $region);

                    // Pro týdenní výzvy přidá obrázek zvířete
                    if ($period === 'weekly') {
                        $side = ($i % 2 === 0) ? 'left' : 'right';

                        $animalImage = ChallengeImage::
                            where('region_id', $region->id)
                            ->where('side', $side)
                            ->inRandomOrder()
                            ->first();

                        $challenge['animalSrc'] = $animalImage ? $animalImage->url : '';
                        $challenge['animalAlt'] = $animalImage ? $animalImage->alt : 'Zvíře';
                        $challenge['animalSide'] = $side;
                        $challenge['bgColor'] = $region->color;
                        $challenge['rewardIconSrc'] = '/img/icons/currency-icon.png';
                        $challenge['rewardIconAlt'] = 'Tlapky';

                        if ($animalImage?->title) {
                            $challenge['title'] = $animalImage->title;
                        }
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
