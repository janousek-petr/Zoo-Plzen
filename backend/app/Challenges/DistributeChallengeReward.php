<?php

namespace App\Challenges;

class DistributeChallengeReward
{
    /**
     * Tato metoda se spustí AUTOMATICKY ve chvíli, kdy Laravel zachytí událost ChallengeCompleted.
     * Zapíše odměny uživateli.
     *
     * @param ChallengeCompleted $event
     * @return void
     */
    public function handle(ChallengeCompleted $event): void
    {
        $progress = $event->progress;
        $profile = $progress->profile;
        $challenge = $progress->activeChallenge;
        $reward = $challenge->data['reward'] ?? 0;

        $profile->increment('points', $reward);
    }
}
