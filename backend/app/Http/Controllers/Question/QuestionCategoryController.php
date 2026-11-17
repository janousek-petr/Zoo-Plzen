<?php

namespace App\Http\Controllers\Question;

use App\Http\Controllers\Controller;
use App\Models\QuestionCategory;

class QuestionCategoryController extends Controller
{
    public function index()
    {
        return response()->json(QuestionCategory::all());
    }
}
