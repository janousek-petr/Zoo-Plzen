<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    //
    protected $table = 'inventory';

    public $timestamps = false;

    public function items() {
        return $this->belongsToMany(Item::class, 'inventory_items');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
