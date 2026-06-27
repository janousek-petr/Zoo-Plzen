<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegionInfo extends Model
{
    protected $table = 'region_info';

    protected $fillable = [
        'region_id',
        'level',
        'text',
    ];

    protected $casts = [
        'level' => 'integer',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}