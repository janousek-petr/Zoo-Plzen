<?php

namespace App\Console\Commands;

use App\Challenges\ChallengeGenerator;
use Illuminate\Console\Command;

class GenerateChallenges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-challenges {--daily} {--weekly}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generuje denní a týdenní výzvy';

    /**
     * Execute the console command.
     */
    public function handle(ChallengeGenerator $generator)
    {
        $dailyCount = config('challenges.daily_count');
        $weeklyCount = config('challenges.weekly_count');


        if ($this->option('daily')) {
            $generator->generateDaily($dailyCount);
        }

        if ($this->option('weekly')) {
            $generator->generateWeekly($weeklyCount);
        }

        $this->info("Výzvy byly úspěšně vygenerovány");
    }
}
