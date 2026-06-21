<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(
            Item::with('category')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'price'              => ['integer', 'min:0'],
            'description'        => ['nullable', 'string'],
            'image'              => ['nullable', 'string'],
            'item_unlock_level'  => ['nullable', 'integer', 'min:1'],
            'category_id'        => ['required', 'exists:item_category,id'],
        ]);

        $item = Item::create($request->only([
            'name', 'price', 'description', 'image', 'item_unlock_level', 'category_id'
        ]));

        return response()->json($item->load('category'), 201);
    }

    public function show(Item $item)
    {
        return response()->json($item->load('category'));
    }

    public function update(Request $request, Item $item)
    {
        $request->validate([
            'name'               => ['sometimes', 'string', 'max:255'],
            'price'              => ['sometimes', 'integer', 'min:0'],
            'description'        => ['sometimes', 'nullable', 'string'],
            'image'              => ['sometimes', 'nullable', 'string'],
            'item_unlock_level'  => ['sometimes', 'nullable', 'integer', 'min:1'],
            'category_id'        => ['sometimes', 'exists:item_category,id'],
        ]);

        $item->update($request->only([
            'name', 'price', 'description', 'image', 'item_unlock_level', 'category_id'
        ]));

        return response()->json($item->load('category'));
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return response()->json(null, 204);
    }
}