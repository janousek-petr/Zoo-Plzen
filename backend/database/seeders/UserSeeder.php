<?php

namespace Database\Seeders;

use DB;
use Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'first_name' => "Jan",
            'last_name' => "Novák",
            'email' => "novak@google.com",
            'password' => Hash::make('Novak1234'),
            'role' => "admin",
            'email_verified_at' => now()
        ]);

        for ($i = 1; $i <= 5; $i++) {
            DB::table('users')->insert([
                'first_name' => "User $i",
                'last_name' => "Last Name $i",
                'email' => "test$i@example.com",
                'password' => Hash::make('Test1234'),
                'role' => "user",
                'email_verified_at' => now()
            ]);
        }
    }
}
