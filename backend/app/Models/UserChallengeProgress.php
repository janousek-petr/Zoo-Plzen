<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserChallengeProgress extends Model
{
    protected $table = 'user_challenge_progress';

    protected $fillable = [
        'user_id',
        'active_challenge_id',
        'progress',
        'completed',
    ];

    public function challenge()
    {
        return $this->belongsTo(ActiveChallenge::class, 'active_challenge_id');
    }
}
