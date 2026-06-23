<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Profile;
use App\Models\Store;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class StoreController extends Controller
{
    private const DEFAULT_MAX_ITEMS = 5;

    /**
     * Display a listing of the resource.
     */
    public function index(int $profileId)
    {
        $profile = Profile::findOrFail($profileId);

        // Zkontroluj, zda má profil obchod - pokud ne, vytvoř ho
        $store = $profile->shop ?? Store::create([
            'profile_id' => $profile->id,
            'max_items' => self::DEFAULT_MAX_ITEMS,
            'is_available' => true,
        ]);

        // Pokud je obchod vypnutý, vrať prázdný obchod
        if (! $store->is_available) {
            return response()->json([]);
        }

        // Pokud je obchod starší než 1 den, obnov ho
        if ($this->shouldRefresh($store)) {
            $this->refreshStore($store, $profile);
        }

        // Vrať aktuální obsah obchodu
        return $this->getStoreItems($store);
    }

    /**
     * Koupí item z aktuální nabídky obchodu profilu.
     */
    public function buy(Request $request, int $profileId)
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer', 'exists:item,id'],
        ]);

        $profile = Profile::findOrFail($profileId);
        $store = $profile->shop;

        if (! $store) {
            throw ValidationException::withMessages([
                'item_id' => 'Obchod ještě nebyl vytvořen.',
            ]);
        }

        $offer = $store->itemsInStore()
            ->whereNull('leave_date')
            ->where('item_id', $data['item_id'])
            ->first();

        if (! $offer) {
            throw ValidationException::withMessages([
                'item_id' => 'Tento předmět není aktuálně v obchodě.',
            ]);
        }

        $item = Item::findOrFail($data['item_id']);

        if ($profile->points < $item->price) {
            throw ValidationException::withMessages([
                'item_id' => 'Nemáš dost pacek na nákup tohoto předmětu.',
            ]);
        }

        DB::transaction(function () use ($profile, $item, $offer) {
            $inventory = $profile->inventory ?? \App\Models\Inventory::create(['profile_id' => $profile->id]);

            $inventory->items()->syncWithoutDetaching([
                $item->id => ['acquisition_date' => now()],
            ]);

            $profile->decrement('points', $item->price);

            // Item zmizí z nabídky obchodu, jakmile je koupený
            $offer->update(['leave_date' => now()]);
        });

        return response()->json($profile->fresh());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Podívá se, zda je zapotřebí obnovit položky v obchodě.
     * Obnova probíhá podle kalendářního dne (ne rolling 24 hodin) -
     * pokud last_refresh_at není dnešní datum, obchod se obnoví.
     *
     * @return bool Pokud je datum _null_, nebo neodpovídá dnešnímu dni
     */
    private function shouldRefresh(Store $store): bool
    {
        if (is_null($store->last_refresh_at)) {
            return true;
        }

        return ! $store->last_refresh_at->isToday();
    }

    /**
     * Obnoví položky v obchodě. Pokud cokoliv selže, last_refresh_at se NEuloží,
     * aby se obnova zkusila znovu při příštím požadavku (žádný "zaseknutý" prázdný obchod).
     */
    private function refreshStore(Store $store, Profile $profile): void
    {
        try {
            DB::transaction(function () use ($store, $profile) {
                // 1) "Uzavření" aktuálních položek nastavením leave_date
                $store->itemsInStore()
                    ->whereNull('leave_date')
                    ->update(['leave_date' => now()]);

                // 2) Získáme ID věcí, které profil už má v inventáři, abychom je nenabízeli znovu
                $inventory = $profile->inventory;
                $ownedItemIds = $inventory
                    ? $inventory->items()->wherePivotNull('loss_date')->pluck('item.id')
                    : collect();

                // 3) Vygenerování nových itemů (čistě náhodně, bez preferencí)
                $newItems = $this->generateItems($ownedItemIds, $store->max_items);

                // 4) Uložení nových itemů do tabulky items_in_store
                $this->saveStoreItems($store, $newItems);

                // 5) Aktualizace času posledního refreshe — jen pokud se vše povedlo
                $store->update(['last_refresh_at' => now()]);
            });
        } catch (\Throwable $exception) {
            \Log::error('Obnova obchodu selhala', [
                'store_id' => $store->id,
                'profile_id' => $profile->id,
                'error' => $exception->getMessage(),
            ]);
            // last_refresh_at zůstává nezměněné -> příští request to zkusí znovu
        }
    }

    /**
     * Vybere náhodné položky do obchodu (bez preferencí), které profil ještě nevlastní.
     */
    private function generateItems($excludeIds, int $limit)
    {
        return Item::query()
            ->whereNotIn('id', $excludeIds)
            ->where('price', '>', 0)
            ->inRandomOrder()
            ->take($limit)
            ->get();
    }

    private function saveStoreItems(Store $store, $items): void
    {
        foreach ($items as $item) {
            $store->itemsInStore()->create([
                'item_id' => $item->id,
                'arrival_date' => today(),
                'leave_date' => null,
            ]);
        }
    }

    /**
     * Vrací pouze věci, které jsou "teď" v obchodě (nemají datum odchodu)
     */
    private function getStoreItems(Store $store)
    {
        return $store->itemsInStore()
            ->whereNull('leave_date')
            ->with(['item.category'])
            ->get();
    }
}