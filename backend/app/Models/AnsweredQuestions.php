<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnsweredQuestions extends Model
{
    //
    protected $table = 'answered_questions';
    protected $fillable = ['answered_quiz_id', 'question_id', 'chosen_answer', 'written_answer'];
    protected $timestamp = false;

    public function answeredQuiz()
    {
        return $this->belongsTo(AnsweredQuizzes::class);
    }
    public function question() {
        return $this->belongsTo(Question::class);
    }
}
