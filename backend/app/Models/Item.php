<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //
    protected $table = 'item';
    public $timestamps = false;
    public $hidden = ['category_id'];

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'items_in_store');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function regions() {
        return $this->belongsToMany(Region::class, 'item_regions');
    }

    public function animals() {
        return $this->belongsToMany(Animal::class, 'item_animals');
    }
}
