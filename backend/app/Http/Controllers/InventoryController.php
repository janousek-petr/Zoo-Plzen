<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Item;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InventoryController extends Controller
{
    // Kategorie, které lze equipnout, a sloupec na Profile, kam se uloží item_id.
    // (id podle item_category tabulky: 1 = Profilovky, 2 = Čepice, 3 = Tapety)
    private const EQUIP_SLOTS = [
        1 => 'avatar_item_id',
        2 => 'accessory_item_id',
        3 => 'wallpaper_item_id',
    ];

    public function index(Profile $profile)
    {
        $inventory = $profile->inventory ?? Inventory::create(['profile_id' => $profile->id]);

        $items = $inventory->items()
            ->with('category')
            ->wherePivotNull('loss_date')
            ->get();

        $equippedIds = [
            $profile->avatar_item_id,
            $profile->accessory_item_id,
            $profile->wallpaper_item_id,
        ];

        $items->each(function (Item $item) use ($equippedIds) {
            $item->equipped = in_array($item->id, $equippedIds);
        });

        return response()->json($items);
    }

    public function equip(Request $request, Profile $profile)
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer', 'exists:item,id'],
        ]);

        $item = Item::with('category')->findOrFail($data['item_id']);
        $categoryId = $item->category?->id;

        if (!isset(self::EQUIP_SLOTS[$categoryId])) {
            throw ValidationException::withMessages([
                'item_id' => 'Tento předmět nelze equipnout.',
            ]);
        }

        $owns = $profile->inventory
            ?->items()
            ->wherePivotNull('loss_date')
            ->where('item.id', $item->id)
            ->exists();

        if (!$owns) {
            throw ValidationException::withMessages([
                'item_id' => 'Tento předmět nevlastníš.',
            ]);
        }

        $slot = self::EQUIP_SLOTS[$categoryId];
        $profile->update([$slot => $item->id]);

        return response()->json($profile->fresh());
    }
}