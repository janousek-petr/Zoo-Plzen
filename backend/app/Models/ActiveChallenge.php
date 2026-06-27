<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActiveChallenge extends Model
{
    protected $table = 'active_challenge';

    protected $fillable = [
        'code',
        'challenge_type',
        'period',
        'data',
        'valid_until',
    ];

    protected $casts = [
        'data' => 'array',
        'valid_until' => 'datetime',
    ];

    public function progress()
    {
        return $this->hasMany(ProfileChallengeProgress::class, 'active_challenge_id');
    }
}
