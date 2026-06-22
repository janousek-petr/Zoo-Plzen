<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';

    public $timestamps = false;
    
    protected $fillable = ['profile_id'];

    public function items() {
        return $this->belongsToMany(Item::class, 'inventory_items');
    }

    public function profile() {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

}
