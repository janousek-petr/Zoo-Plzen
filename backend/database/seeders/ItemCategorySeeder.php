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
            ['name' => 'Profilovky', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Doplňky', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Tapety', 'parent_id' => null]
        );

        DB::table('item_category')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Fotografie', 'parent_id' => null]
        );
    }
}