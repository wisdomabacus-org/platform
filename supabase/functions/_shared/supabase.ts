// supabase/functions/_shared/supabase.ts
// Shared Supabase client for Edge Functions

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

// Types for user from JWT
export interface AuthUser {
    id: string;
    email?: string;
    phone?: string;
    role?: string;
}

/**
 * Create a Supabase client with service role (full access)
 * Use this for operations that need to bypass RLS
 */
export function createServiceClient(): SupabaseClient {
    return createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

/**
 * Create a Supabase client with the user's JWT
 * Use this for operations that should respect RLS
 */
export function createUserClient(accessToken: string): SupabaseClient {
    return createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

/**
 * Get the authenticated user from the request
 * Returns null if not authenticated
 */
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServiceClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(req: Request): Promise<AuthUser> {
    const user = await getAuthUser(req);
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}
