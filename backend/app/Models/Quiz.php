<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
        'region_id',
    ];

    protected $table = 'quiz';
    protected $hidden = ['region_id'];
    public $timestamps = false;
    protected $appends = ['total_points', 'total_questions'];

    /**
     * Vrátí sumu bodů kvízu
     * @return int
     */
    public function getTotalPointsAttribute()
    {
        return $this->questions()->sum('points');
    }

    /**
     * Vrátí počet otázek kvízu
     * @return int
     */
    public function getTotalQuestionsAttribute()
    {
        return $this->questions()->count();
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'quiz_question');
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function answeredQuizzes() {
        return $this->hasMany(AnsweredQuizzes::class);
    }
}
