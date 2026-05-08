<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    //
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
