<?php

namespace Database\Seeders;

use App\Models\ChallengeTemplate;
use Illuminate\Database\Seeder;

class ChallengeTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = config('challenges.templates', []);
        $periods = [
            'daily'  => config('challenges.daily', []),
            'weekly' => config('challenges.weekly', []),
        ];

        foreach ($periods as $periodName => $periodItems) {
            foreach ($periodItems as $item) {
                $templateKey = $item['templates'] ?? null;

                // Pokud šablona podle klíče neexistuje, přeskočíme
                if (!$templateKey || !isset($templates[$templateKey])) {
                    continue;
                }

                $baseTemplate = $templates[$templateKey];

                ChallengeTemplate::firstOrCreate(
                    [
                        'type'   => $baseTemplate['type'] ?? $templateKey,
                        'period' => $periodName,
                    ],
                    // Hodnoty pro vložení (specifické z daily/weekly mají přednost před základní šablonou)
                    [
                        'title'        => $item['title'] ?? $baseTemplate['title'] ?? '',
                        'code_pattern' => $item['code_pattern'] ?? $baseTemplate['code_pattern'] ?? null,
                        'description'  => $item['description'] ?? $baseTemplate['description'] ?? '',
                        'min_target'   => $item['min'] ?? $baseTemplate['min'] ?? 1,
                        'max_target'   => $item['max'] ?? $baseTemplate['max'] ?? 10,
                        'reward_paw'   => $item['reward'] ?? $baseTemplate['reward'] ?? 0,
                    ]
                );
            }
        }

        /*
        foreach ($templates as $key => $template) {
            ChallengeTemplate::firstOrCreate(
                [
                    'type' => $template['type'] ?? $key,
                ],
                [
                    'title'        => $template['title'] ?? '',
                    'code_pattern' => $template['code_pattern'] ?? null,
                    'description'  => $template['description'] ?? '',
                    'min_target'   => $template['min'] ?? 1,
                    'max_target'   => $template['max'] ?? 10,
                    'reward_paw'   => $template['reward'] ?? 0,
                ]
            );
        }
        */
    }
}
