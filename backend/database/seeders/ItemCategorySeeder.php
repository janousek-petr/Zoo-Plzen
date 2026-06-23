<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('item_category')->updateOrInsert(
            ['id' => 1],
            ['name' => 'Profilovka', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Doplňek', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Tapeta', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Fotka', 'parent_id' => null]
        );
    }
}