<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table = 'store';

    protected $casts = [
        'last_refresh_at' => 'datetime',
        'is_available' => 'boolean',
    ];

    protected $fillable = ['profile_id', 'max_items', 'is_available', 'last_refresh_at'];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function itemsInStore()
    {
        return $this->hasMany(ItemsInStore::class);
    }
}