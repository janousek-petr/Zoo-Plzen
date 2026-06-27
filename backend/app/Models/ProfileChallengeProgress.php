<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileChallengeProgress extends Model
{
    protected $table = 'profile_challenge_progress';

    protected $fillable = [
        'profile_id',
        'active_challenge_id',
        'progress',
        'completed',
    ];

    public function challenge()
    {
        return $this->belongsTo(ActiveChallenge::class, 'active_challenge_id');
    }

    public function profile() {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function activeChallenge() {
        return $this->belongsTo(ActiveChallenge::class, 'active_challenge_id');
    }
}
