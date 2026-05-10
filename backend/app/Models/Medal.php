<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medal extends Model
{
    protected $fillable = [
        'name',
        'image_url',
        'description',
        'condition',
    ];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_medals')
                    ->withPivot('earned_at')
                    ->withTimestamps();
    }
}