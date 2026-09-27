<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeImage extends Model
{
    //
    protected $table = 'challenge_image';

    protected $fillable = [
        'region_id',
        'media_id',
        'side',
        'title',
        'alt'
    ];

    public function region() {
        return $this->belongsTo(Region::class, 'region_id');
    }


}
