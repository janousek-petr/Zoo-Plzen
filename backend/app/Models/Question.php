<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    //
    use SoftDeletes;
    protected $fillable = [
        'text',
        'image',
        'points',
        'question_category',
    ];
    protected $hidden = ['question_category'];

    protected $table = 'question';

    public $timestamps = false;

    /**
     * Bootovací metoda pro registraci událostí modelu.
     */
    protected static function booted(): void
    {
        // Spustí se AUTOMATICKY před smazáním otázky ($question->delete())
        static::deleting(function (Question $question) {
            if ($question->isForceDeleting()) {
                // Pokud mažete otázku trvale z DB (forceDelete), smažou se trvale i odpovědi
                $question->answers()->forceDelete();
            } else {
                // Pro běžný Soft Delete provedeme Soft Delete i na všech odpovědích
                $question->answers()->delete();
            }
        });

        // (Volitelné) Pokud v adminu obnovíte smazanou otázku ($question->restore())
        static::restoring(function (Question $question) {
            $question->answers()->onlyTrashed()->restore();
        });
    }

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

    public function answeredQuestions() {
        return $this->hasMany(AnsweredQuestions::class);
    }
}
