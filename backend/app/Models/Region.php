<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    //
    protected $table = 'region';
    public $timestamps = false;

    // app/Models/Region.php
    public function infos()
    {
        return $this->hasMany(RegionInfo::class, 'region_id');
    }
}
