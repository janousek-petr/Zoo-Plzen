<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeRegionImage extends Model
{
    //
    protected $table = 'challenge_region_image';

    protected $fillable = [
        'region_id',
        'url',
        'side',
        'title',
        'alt'
    ];

    public function region() {
        return $this->belongsTo(Region::class, 'region_id');
    }


}
