<?php

namespace App\Http\Controllers;

use App\Models\QuestionCategory;

class QuestionCategoryController extends Controller
{
    public function index()
    {
        return response()->json(QuestionCategory::all());
    }
}