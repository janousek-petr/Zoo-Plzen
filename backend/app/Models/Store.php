<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    //
    protected $table = 'store';
    protected $casts = [
        'last_refresh_at' => 'datetime',
        'is_available' => 'boolean',
    ];

    public $fillable = ['last_refresh_at'];
    public function itemsInStore()
    {
        return $this->hasMany(ItemsInStore::class);
    }
}
