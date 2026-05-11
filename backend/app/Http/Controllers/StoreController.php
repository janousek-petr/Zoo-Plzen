<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Profile;
use DB;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $profileId)
    {
        $user = Profile::find($profileId);

        // Zkontroluj, zda má uživatel obchod
        $store = $user->shop;

        if (! $store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        // Pokud je obchod vypnutý, vrať prázdný obchod
        if (! $store->is_available) {
            return response()->json();
        }

        // Pokud je obchod starší než 1 den, obnov ho
        if ($this->shouldRefresh($store)) {
            $this->refreshStore($store, $user);
        }

        // Vrať aktuální obsah obchodu
        return $this->getStoreItems($store);
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
     * Podívá se, zda je zapotřebí obnovit položky v obchodě
     *
     * @return true Pokud je datum _null_, nebo _last_refresh_at_ je statší než 24 hodin
     */
    private function shouldRefresh($store)
    {
        // Pokud je datum null (první návštěva), vratí TRUE (obnovit)
        if (is_null($store->last_refresh_at)) {
            return true;
        }

        // 2. Pokud je datum starší než 24 hodin, vrátí TRUE (obnovit)
        // 3. Jinak FALSE (nic nedělat)
        return $store->last_refresh_at->isBefore(now()->subDay());
    }

    /**
     * Obnoví položky v obchodě
     *
     * @return \Illuminate\Http\JsonResponse|void
     */
    private function refreshStore($store, $user)
    {
        try {
            DB::transaction(function () use ($store, $user) {
                // 1) "Uzavření" aktuálních položek nastavením leave_date
                $store->itemsInStore()
                    ->whereNull('leave_date')
                    ->update(['leave_date' => now()]);

                // 2) Příprava dat pro generování
                $preferences = $user->preferences;

                // Získáme ID věcí, které uživatel už má v inventáři, abychom je nenabízeli znovu
                $ownedItemsIds = $user->inventory->items()
                    ->whereNull('loss_date')
                    ->pluck('item_id');

                // 3) Vygenerování nových itemů
                $newItems = $this->generateItems($preferences, $ownedItemsIds, $store->maxItems);

                // 4) Uložení nových itemů do tabulky items_in_store
                $this->saveStoreItems($store, $newItems);

                // 5) Aktualizace času posledního refreshe (timestamp)
                $store->update(['last_refresh_at' => now()]);
            });
        } catch (\Throwable $exception) {
            return response()->json(['message' => 'Error in Store'], 500);
        }
    }

    /**
     * Vybere položky do obchodu
     *
     * Pokud _$preferences_ není prázdný, vyberou se primárně jenom položy patřící do preferencí.
     *
     * Pokud je počet vybraných položek menší než nastavený limit, přidají se do seznamu náhodné položky.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function generateItems($preferences, $excludeIds, $limit)
    {
        $query = Item::query()
            ->whereNotIn('item_id', $excludeIds)
            ->where('price', '>', 0);

        // Pokud uživatel MÁ nějaké preference
        if ($preferences && $preferences->isNotEmpty()) {
            $query->where(function ($mainQuery) use ($preferences) {
                foreach ($preferences as $pref) {
                    // Region preference
                    if ($pref->region_id) {
                        $mainQuery->orWhereHas('regions', function ($r) use ($pref) {
                            $r->where('region.id', $pref->region_id);
                        });
                    }

                    // Zvíře preference
                    if ($pref->animal_id) {
                        $mainQuery->orWhereHas('animals', function ($a) use ($pref) {
                            $a->where('animal.id', $pref->animal_id);
                        });
                    }
                }
            });
        }

        // Vezme jenom počet náhodných položek podle $limit
        $items = $query->inRandomOrder()->take($limit)->get();

        // Pokud jsme našli méně, než je limit, doplníme zbytek náhodně
        if ($items->count() < $limit) {
            $needed = $limit - $items->count();

            // Seznam ID, které už v obchodě máme nebo které uživatel vlastní
            $alreadySelectedIds = array_merge($excludeIds, $items->pluck('item_id')->toArray());

            $additionalItems = Item::whereNotIn('item_id', $alreadySelectedIds)
                ->where('price', '>', 0)
                ->inRandomOrder()
                ->take($needed)
                ->get();

            // Sloučíme preferované věci s těmi doplňkovými
            $items = $items->concat($additionalItems);
        }

        return $items;
    }

    private function saveStoreItems($store, $items)
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
     *
     * @return mixed
     */
    private function getStoreItems($store)
    {
        return $store->itemsInStore()
            ->whereNull('leave_date')
            ->with(['item.category'])
            ->get();
    }
}
