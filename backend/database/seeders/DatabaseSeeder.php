<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


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
            ItemCategorySeeder::class,
            RegionInfoSeeder::class,
            UserSeeder::class,
            ChallengeTemplateSeeder::class,
            ChallengeImageSeeder::class,
        ]);
    }
}
