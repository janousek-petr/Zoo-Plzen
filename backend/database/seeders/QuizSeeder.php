<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // Nezapomeň na tento import

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('quiz')->insert([
            [
                'name' => 'První testovací kvíz',
                'description' => 'Popis k prvnímu kvízu, který načítám z Laravelu.',
                'region_id' => 1, // Ujisti se, že region s ID 1 existuje!
                'created_at' => now()
            ],
        ]);
    }
}