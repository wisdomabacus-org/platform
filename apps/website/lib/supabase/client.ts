/**
 * Supabase Browser Client
 * Use this in Client Components (components with 'use client' directive)
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@platform/database';

/**
 * Create a Supabase client for use in Client Components
 * This client handles auth token refresh automatically via cookies
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
