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
        'avatar_item_id',
        'accessory_item_id',
        'wallpaper_item_id',
        'displayed_medals',
        'level',
        'xp',
        'points',
        'last_daily_reward_at',
    ];

    protected $casts = [
        'displayed_medals' => 'array',
        'last_daily_reward_at' => 'datetime',
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

    public function avatarItem()
    {
        return $this->belongsTo(Item::class, 'avatar_item_id');
    }

    public function accessoryItem()
    {
        return $this->belongsTo(Item::class, 'accessory_item_id');
    }

    public function wallpaperItem()
    {
        return $this->belongsTo(Item::class, 'wallpaper_item_id');
    }
}
