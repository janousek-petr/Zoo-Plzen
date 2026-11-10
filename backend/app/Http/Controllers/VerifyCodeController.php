<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VerifyCodeController extends Controller
{
    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user(); // Přihlášený neověřený uživatel

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'Zadaný kód je neplatný.'], 422);
        }

        if (now()->greaterThan($user->verification_code_expires_at)) {
            return response()->json(['message' => 'Platnost kódu vypršela. Nechte si poslat nový.'], 422);
        }

        // Označení uživatele jako ověřeného
        $user->markEmailAsVerified();
        $user->update([
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ]);

        return response()->json(['message' => 'E-mail byl úspěšně ověřen.']);
    }
}
