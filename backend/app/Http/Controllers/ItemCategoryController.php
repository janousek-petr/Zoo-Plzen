<?php

namespace App\Http\Controllers;

use App\Models\ItemCategory;

class ItemCategoryController extends Controller
{
    public function index()
    {
        return response()->json(ItemCategory::all());
    }
}