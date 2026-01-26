// supabase/functions/exam-answer/index.ts
// Save an answer during exam

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, requireAuth } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface SubmitAnswerRequest {
    session_token: string;
    question_id: string;
    selected_option_index: number;
}

interface SubmitAnswerResponse {
    success: boolean;
    question_id: string;
    selected_option_index: number;
    saved_at: number;
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const user = await requireAuth(req);
        const supabase = createServiceClient();

        const body: SubmitAnswerRequest = await req.json();
        const { session_token, question_id, selected_option_index } = body;

        if (!session_token || !question_id || selected_option_index === undefined) {
            return errorResponse(
                "session_token, question_id, and selected_option_index are required",
                400
            );
        }

        // Get and validate session
        const { data: session, error: sessionError } = await supabase
            .from("exam_sessions")
            .select("*")
            .eq("session_token", session_token)
            .single();

        if (sessionError || !session) {
            return errorResponse("Session not found or expired", 404);
        }

        // Verify ownership
        if (session.user_id !== user.id) {
            return errorResponse("You don't have access to this session", 403);
        }

        // Check session status
        if (session.status !== "in-progress") {
            return errorResponse(
                `Cannot save answers - exam is ${session.status}`,
                400
            );
        }

        // Check if time expired
        const now = Date.now();
        const endTime = new Date(session.end_time).getTime();
        if (now > endTime) {
            return errorResponse("Exam time has expired", 400);
        }

        // Update answers in session (JSONB update)
        const currentAnswers = session.answers || {};
        const updatedAnswers = {
            ...currentAnswers,
            [question_id]: {
                selected_option_index,
                answered_at: now,
            },
        };

        const { error: updateError } = await supabase
            .from("exam_sessions")
            .update({
                answers: updatedAnswers,
                updated_at: new Date().toISOString(),
            })
            .eq("id", session.id);

        if (updateError) {
            console.error("Answer save error:", updateError);
            return errorResponse("Failed to save answer", 500);
        }

        const response: SubmitAnswerResponse = {
            success: true,
            question_id,
            selected_option_index,
            saved_at: now,
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("exam-answer error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
