<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnsweredQuizzes extends Model
{
    //
    protected $table = 'answered_quizzes';

    protected $fillable = ['quiz_id', 'score', 'profile_id'];

    protected $dates = ['answered_at'];

    public $timestamps = false;

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function answeredQuestions()
    {
        return $this->hasMany(AnsweredQuestions::class);
    }
}
