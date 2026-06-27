<?php

namespace App\Challenges;

use App\Models\ProfileChallengeProgress;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChallengeCompleted
{
    use Dispatchable, SerializesModels;

    public ProfileChallengeProgress $progress;

    public function __construct(ProfileChallengeProgress $progress)
    {
        $this->progress = $progress;
    }
}
