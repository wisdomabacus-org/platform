/**
 * Auth Callback Route Handler
 * 
 * Handles OAuth callback from Supabase (Google, etc.)
 * Exchanges the auth code for a session and redirects to the app.
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;
    const next = requestUrl.searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Auth callback error:', error.message);
            // Redirect to home with error
            return NextResponse.redirect(`${origin}/?error=auth_callback_error`);
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}${next}`);
}
