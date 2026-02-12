// supabase/functions/_shared/cors.ts
// CORS headers for Edge Functions

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

/**
 * Handle OPTIONS preflight request
 */
export function handleCors(req: Request): Response | null {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }
    return null;
}

/**
 * Create a JSON response with CORS headers
 */
export function jsonResponse(
    data: unknown,
    status: number = 200
): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });
}

/**
 * Create an error response with CORS headers
 */
export function errorResponse(
    message: string,
    status: number = 400
): Response {
    return new Response(
        JSON.stringify({
            success: false,
            error: message,
        }),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        }
    );
}
