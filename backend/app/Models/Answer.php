<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    //
    use SoftDeletes;
    protected $fillable = [
        'question_id',
        'text',
        'correct_input',
        'is_correct',
        'image',
    ];

    protected $table = 'answer';

    public $timestamps = false;

    public function questions()
    {
        return $this->belongsTo(Question::class);
    }
}
