<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Vygeneruje heslo: pouze A-Z, a-z, 0-9, min. 10 znaků,
     * obsahuje aspoň jedno velké písmeno a jednu číslici.
     */
    private function generatePassword(int $length = 10): string
    {
        $lower  = 'abcdefghijklmnopqrstuvwxyz';
        $upper  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $digits = '0123456789';
        $all    = $lower . $upper . $digits;

        // zaručíme aspoň 1 velké písmeno a 1 číslici
        $password = [
            $upper[random_int(0, strlen($upper) - 1)],
            $digits[random_int(0, strlen($digits) - 1)],
        ];

        for ($i = count($password); $i < $length; $i++) {
            $password[] = $all[random_int(0, strlen($all) - 1)];
        }

        shuffle($password);

        return implode('', $password);
    }

    public function index()
    {
        $users = User::withCount('profiles')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::withCount('profiles')
            ->with('profiles')
            ->findOrFail($id);

        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
        ]);

        $plainPassword = $this->generatePassword(10); // A-Z, a-z, 0-9, min. velké písmeno + číslice

        $user = User::create([
            ...$validated,
            'password' => bcrypt($plainPassword),
            'role'     => 'user',
        ]);

        return response()->json([
            'user' => $user,
            'generated_password' => $plainPassword, // vrátí se JEN při vytvoření
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $id,
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    public function profiles($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user->profiles);
    }
}