<?php

namespace App\Challenges;

class DistributeChallengeReward
{
    public function handle(ChallengeCompleted $event): void
    {
        $progress = $event->progress;
        $profile = $progress->profile;
        $challenge = $progress->activeChallenge;


        $reward = $challenge->data['reward'] ?? 0;

        $profile->increment('points', $reward);
    }
}
