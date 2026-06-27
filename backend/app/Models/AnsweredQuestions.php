<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnsweredQuestions extends Model
{
    //
    protected $table = 'answered_questions';
    protected $fillable = ['answered_quiz_id', 'question_id', 'chosen_answer', 'written_answer'];

    public $casts = ['answered_at' => 'datetime:m.d.Y'];

    public $timestamps = false;

    public function answeredQuiz()
    {
        return $this->belongsTo(AnsweredQuizzes::class);
    }

    public function question() {
        return $this->belongsTo(Question::class);
    }

    public function chosenAnswer() {
        return $this->belongsTo(Answer::class , 'chosen_answer');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id');
    }
}
