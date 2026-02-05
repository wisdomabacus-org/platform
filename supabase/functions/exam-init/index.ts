// supabase/functions/exam-init/index.ts
// Initialize exam portal - load questions for active session

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, authenticateBySessionToken } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import type { ExamQuestionForClient } from "../_shared/types.ts";

interface InitExamRequest {
    session_token: string;
}

interface InitExamResponse {
    session_token: string;
    submission_id: string;
    exam_type: string;
    exam_id: string;
    exam_title: string;
    duration_minutes: number;
    total_questions: number;
    time_remaining: number; // seconds
    start_time: number;
    end_time: number;
    questions: ExamQuestionForClient[];
    saved_answers: Record<string, number>; // questionId -> selectedOptionIndex
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const body: InitExamRequest = await req.json();
        const { session_token } = body;

        if (!session_token) {
            return errorResponse("session_token is required", 400);
        }

        // Authenticate via session token (no JWT required for exam portal)
        // This verifies the session is valid and gets the user/session data
        const { user, session } = await authenticateBySessionToken(session_token);
        const supabase = createServiceClient();

        // The session is already validated by authenticateBySessionToken
        // It checks: existence, status, and time-based expiration

        // Get submission to find question bank ID
        const { data: submission, error: subError } = await supabase
            .from("submissions")
            .select("exam_snapshot")
            .eq("id", session.submission_id)
            .single();

        if (subError || !submission) {
            return errorResponse("Submission not found", 404);
        }

        const questionBankId = submission.exam_snapshot?.questionBankId;
        if (!questionBankId) {
            return errorResponse("Question bank not found in submission", 500);
        }

        // Load questions (without correct answers)
        const { data: questions, error: questionsError } = await supabase
            .from("questions")
            .select(
                `
        id,
        question_text,
        image_url,
        marks,
        question_options (
          option_index,
          text
        )
      `
            )
            .eq("question_bank_id", questionBankId)
            .order("sort_order", { ascending: true });

        if (questionsError) {
            console.error("Questions load error:", questionsError);
            return errorResponse("Failed to load questions", 500);
        }

        // Format questions for client (no correct answers!)
        const formattedQuestions: ExamQuestionForClient[] = (questions || []).map(
            (q: {
                id: string;
                question_text: string;
                image_url?: string;
                marks: number;
                question_options: { option_index: number; text: string }[];
            }) => ({
                id: q.id,
                question_text: q.question_text,
                image_url: q.image_url,
                marks: q.marks,
                options: (q.question_options || [])
                    .sort((a, b) => a.option_index - b.option_index)
                    .map((opt) => ({
                        index: opt.option_index,
                        text: opt.text,
                    })),
            })
        );

        // Extract saved answers from session
        const savedAnswers: Record<string, number> = {};
        const sessionAnswers = session.answers || {};
        for (const [questionId, answer] of Object.entries(sessionAnswers)) {
            if (
                answer &&
                typeof answer === "object" &&
                "selected_option_index" in answer
            ) {
                savedAnswers[questionId] = (
                    answer as { selected_option_index: number }
                ).selected_option_index;
            }
        }

        // Calculate time remaining
        const now = Date.now();
        const endTime = new Date(session.end_time).getTime();
        const timeRemaining = Math.max(
            0,
            Math.floor((endTime - now) / 1000)
        );

        const response: InitExamResponse = {
            session_token: session.session_token,
            submission_id: session.submission_id,
            exam_type: session.exam_type,
            exam_id: session.exam_id,
            exam_title: submission.exam_snapshot?.title || "Exam",
            duration_minutes: session.duration_minutes,
            total_questions: formattedQuestions.length,
            time_remaining: timeRemaining,
            start_time: new Date(session.start_time).getTime(),
            end_time: endTime,
            questions: formattedQuestions,
            saved_answers: savedAnswers,
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("exam-init error:", error);

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
                return errorResponse("This exam has already been submitted", 400);
            }
            if (message === "Session has expired") {
                return errorResponse("Exam session has expired", 400);
            }
            if (message === "Unauthorized") {
                return errorResponse("Unauthorized", 401);
            }
        }

        return errorResponse("Internal server error", 500);
    }
});

