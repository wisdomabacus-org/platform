/**
 * Supabase Middleware Utilities
 * Handle session refresh in Next.js middleware
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@platform/database';

/**
 * Update the user session
 * This should be called in middleware to refresh expired auth tokens
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Do NOT use getSession() here as it's not safe.
    // Use getUser() which validates the JWT against Supabase servers
    // This is critical for security - getSession reads from unverified cookies
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Optional: Redirect unauthenticated users from protected routes
    // Uncomment and customize if you have protected routes
    // const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    // if (!user && isProtectedRoute) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = '/login';
    //   return NextResponse.redirect(url);
    // }

    return supabaseResponse;
}
