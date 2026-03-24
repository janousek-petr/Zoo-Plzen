<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    protected $fillable = [
        'text',
        'image',
        'points',
        'question_category',
    ];
    protected $hidden = ['question_category'];

    protected $table = 'question';

    public $timestamps = false;

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function category()
    {
        return $this->belongsTo(QuestionCategory::class, 'question_category');
    }

    public function quizzes()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_question');
    }
}
