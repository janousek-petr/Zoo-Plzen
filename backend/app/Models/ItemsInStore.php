<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemsInStore extends Model
{
    protected $table = 'items_in_store';

    public $timestamps = false;

    protected $fillable = ['item_id', 'arrival_date', 'leave_date', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}