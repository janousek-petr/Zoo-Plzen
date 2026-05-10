<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Model;

class ItemsInStore extends Model
{
    //
    protected $table = 'items_in_store';

    public $timestamps = false;
    public $hidden = ['store_id', 'arrival_date', 'leave_date', 'item_id', 'id'];

    protected $appends = ['is_bought'];
    public $fillable = ['item_id', 'arrival_date', 'leave_date', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function getIsBoughtAttribute()
    {
        $user = auth()->user();

        if (! $user || ! $user->inventory()) {
            return false;
        }

        return DB::table('inventory_items')
            ->where('inventory_id', $user->inventory->id)
            ->where('item_id', $this->item_id)
            ->whereNull('loss_date')
            ->exists();
    }
}
