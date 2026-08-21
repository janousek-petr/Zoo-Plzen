<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request, $id, $hash): RedirectResponse
    {
        $frontEndUrl = config('app.frontend_url');
        $user = User::find($id);

        if (!$user || !hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect($frontEndUrl . '/overeni-emailu?verify=false');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(
                $frontEndUrl .'/zvoleni-profilu'
            );
        }
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->intended(
            $frontEndUrl.'/overeni-emailu?verify=true'
        );
    }
}
