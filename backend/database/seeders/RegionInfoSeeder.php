<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionInfoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('region_info')->insert([
            [
                'region_id' => 1,
                'level' => 1,
                'text' => "Základní info o Africe 1",
                'created_at' => now()
            ],
            [
                'region_id' => 1,
                'level' => 1,
                'text' => "Základní info o Africe 2",
                'created_at' => now()
            ],
            [
                'region_id' => 1,
                'level' => 2,
                'text' => "Další info o Africe 1",
                'created_at' => now()
            ],
             [
                'region_id' => 1,
                'level' => 2,
                'text' => "Další info o Africe 2",
                'created_at' => now()
            ],
            [
                'region_id' => 1,
                'level' => 3,
                'text' => "Extra info o Africe 1",
                'created_at' => now()
            ],
            [
                'region_id' => 1,
                'level' => 3,
                'text' => "Extra info o Africe 2",
                'created_at' => now()
            ],
        ]);
    }
}