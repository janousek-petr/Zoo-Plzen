<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Quiz; // Předpokládám, že model existuje
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        /*$user = User::factory()->create([
            'first_name' => 'Petr',
            'last_name' => 'Novák',
            'email' => 'admin@test.cz',
        ]);*/

    
        $this->call([
            RegionSeeder::class,
            QuestionCategorySeeder::class,
            QuizSeeder::class,
            QuestionSeeder::class,
            AnswerSeeder::class,
            ItemCategorySeeder::class
        ]);
    }
}