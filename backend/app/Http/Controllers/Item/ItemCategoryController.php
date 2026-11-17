<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\ItemCategory;

class ItemCategoryController extends Controller
{
    public function index()
    {
        return response()->json(ItemCategory::all());
    }
}
