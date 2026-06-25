<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnsweredQuizzes extends Model
{
    //
    protected $table = 'answered_quizzes';

    protected $fillable = ['quiz_id', 'profile_id', 'score', 'answered_at'];

    protected $dates = ['answered_at'];

    public $timestamps = false;

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function answeredQuestions()
    {
        return $this->hasMany(AnsweredQuestion::class);
    }
}