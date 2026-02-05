// supabase/functions/exam-answer/index.ts
// Save an answer during exam

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, authenticateBySessionToken } from "../_shared/supabase.ts";
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
        const body: SubmitAnswerRequest = await req.json();
        const { session_token, question_id, selected_option_index } = body;

        if (!session_token || !question_id || selected_option_index === undefined) {
            return errorResponse(
                "session_token, question_id, and selected_option_index are required",
                400
            );
        }

        // Authenticate via session token (no JWT required for exam portal)
        const { user, session } = await authenticateBySessionToken(session_token);
        const supabase = createServiceClient();

        // Check session status (authenticateBySessionToken already validates expiration)
        if (session.status !== "in-progress") {
            return errorResponse(
                `Cannot save answers - exam is ${session.status}`,
                400
            );
        }

        // Update answers in session (JSONB update)
        const now = Date.now();
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

        // Handle specific session errors with appropriate status codes
        if (error instanceof Error) {
            const message = error.message;

            if (message === "Session token is required") {
                return errorResponse(message, 400);
            }
            if (message === "Session not found or expired") {
                return errorResponse(message, 404);
            }
            if (message === "Session already submitted") {
                return errorResponse("Cannot save answers - exam already submitted", 400);
            }
            if (message === "Session has expired") {
                return errorResponse("Exam time has expired", 400);
            }
            if (message === "Unauthorized") {
                return errorResponse("Unauthorized", 401);
            }
        }

        return errorResponse("Internal server error", 500);
    }
});
