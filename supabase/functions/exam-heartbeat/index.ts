// supabase/functions/exam-heartbeat/index.ts
// Keep exam session alive and check status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, requireAuth } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface HeartbeatRequest {
    session_token: string;
}

interface HeartbeatResponse {
    is_active: boolean;
    time_remaining: number; // seconds
    answered_count: number;
    status: string;
    should_auto_submit: boolean;
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const user = await requireAuth(req);
        const supabase = createServiceClient();

        const body: HeartbeatRequest = await req.json();
        const { session_token } = body;

        if (!session_token) {
            return errorResponse("session_token is required", 400);
        }

        // Get session
        const { data: session, error: sessionError } = await supabase
            .from("exam_sessions")
            .select("*")
            .eq("session_token", session_token)
            .single();

        if (sessionError || !session) {
            return jsonResponse({
                success: true,
                data: {
                    is_active: false,
                    time_remaining: 0,
                    answered_count: 0,
                    status: "not_found",
                    should_auto_submit: false,
                } as HeartbeatResponse,
            });
        }

        // Verify ownership
        if (session.user_id !== user.id) {
            return errorResponse("You don't have access to this session", 403);
        }

        const now = Date.now();
        const endTime = new Date(session.end_time).getTime();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        const answeredCount = Object.keys(session.answers || {}).length;

        // Check if time expired and session should be auto-submitted
        if (timeRemaining <= 0 && session.status === "in-progress") {
            // Trigger auto-submit by calling exam-submit internally
            // For now, we mark it for client to handle
            const response: HeartbeatResponse = {
                is_active: false,
                time_remaining: 0,
                answered_count,
                status: "expired",
                should_auto_submit: true,
            };
            return jsonResponse({ success: true, data: response });
        }

        // Session still active
        const response: HeartbeatResponse = {
            is_active: session.status === "in-progress",
            time_remaining,
            answered_count,
            status: session.status,
            should_auto_submit: false,
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("exam-heartbeat error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
