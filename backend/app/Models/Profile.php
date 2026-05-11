<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'nickname',
        'avatar_url',
        'accessory_url',
        'wallpaper_url',
        'displayed_medals',
        'level',
        'xp',
    ];

    protected $casts = [
        'displayed_medals' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function medals()
    {
        return $this->belongsToMany(Medal::class, 'profile_medals')
                    ->withPivot('earned_at')
                    ->withTimestamps();
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function answeredQuizzes()
    {
        return $this->hasMany(AnsweredQuestions::class);
    }

    public function shop()
    {
        return $this->hasOne(Store::class);
    }

    public function preferences()
    {
        return $this->hasMany(Preference::class);
    }
}
