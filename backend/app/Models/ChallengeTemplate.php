<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeTemplate extends Model
{
    //
    public $fillable = ['min_target', 'max_target', 'reward_xp', 'is_active', 'title', 'description', 'reward_paw'];

    public $table = 'challenge_template';
}
