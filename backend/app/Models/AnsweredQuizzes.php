<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnsweredQuizzes extends Model
{
    //
    protected $table = 'answered_quizzes';

    protected $fillable = ['quiz_id', 'user_id', 'score'];
    protected $dates = ['answered_at'];

    protected $timestamp = false;

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
