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
    }
}
