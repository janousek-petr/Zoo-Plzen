<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('quiz')->insert([
            [
                'name' => 'Africký kvíz - Level 1',
                'description' => 'Základní otázky o Africe.',
                'region_id' => 1,
                'level' => 1,
                'created_at' => now()
            ],
            [
                'name' => 'Africký kvíz - Level 2',
                'description' => 'Středně těžké otázky o Africe.',
                'region_id' => 1,
                'level' => 2,
                'created_at' => now()
            ],
            [
                'name' => 'Africký kvíz - Level 3',
                'description' => 'Těžké otázky o Africe.',
                'region_id' => 1,
                'level' => 3,
                'created_at' => now()
            ],
        ]);
    }
}