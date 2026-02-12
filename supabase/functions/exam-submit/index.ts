// supabase/functions/exam-submit/index.ts
// Submit exam - calculate score and finalize submission

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface SubmitExamRequest {
    session_token: string;
}

interface SubmitExamResponse {
    success: boolean;
    submission_id: string;
    exam_type: string;
    score: number;
    total_marks: number;
    correct_answers: number;
    incorrect_answers: number;
    unanswered: number;
    time_taken: number; // seconds
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const body: SubmitExamRequest = await req.json();
        const { session_token } = body;

        if (!session_token) {
            return errorResponse("session_token is required", 400);
        }

        const supabase = createServiceClient();

        // Get session with lock check (we don't use authenticateBySessionToken 
        // because submit should work even for expired sessions)
        const { data: session, error: sessionError } = await supabase
            .from("exam_sessions")
            .select("*")
            .eq("session_token", session_token)
            .single();

        if (sessionError || !session) {
            return errorResponse("Session not found or expired", 404);
        }

        // Check if already submitted
        if (session.status === "submitted") {
            // Return existing submission result
            const { data: existingSubmission } = await supabase
                .from("submissions")
                .select("*")
                .eq("id", session.submission_id)
                .single();

            if (existingSubmission) {
                return jsonResponse({
                    success: true,
                    data: {
                        success: true,
                        submission_id: existingSubmission.id,
                        exam_type: existingSubmission.exam_type,
                        score: existingSubmission.score,
                        total_marks: existingSubmission.exam_snapshot?.totalMarks || 0,
                        correct_answers: existingSubmission.correct_answers,
                        incorrect_answers: existingSubmission.incorrect_answers,
                        unanswered: existingSubmission.unanswered,
                        time_taken: existingSubmission.time_taken,
                    } as SubmitExamResponse,
                });
            }
        }

        // Lock session to prevent double submission
        const { data: lockResult, error: lockError } = await supabase
            .from("exam_sessions")
            .update({ is_locked: true })
            .eq("id", session.id)
            .eq("is_locked", false) // Only update if not already locked
            .select()
            .single();

        if (lockError || !lockResult) {
            return errorResponse("Exam is already being submitted", 409);
        }

        try {
            // Get submission data
            const { data: submission, error: subError } = await supabase
                .from("submissions")
                .select("*")
                .eq("id", session.submission_id)
                .single();

            if (subError || !submission) {
                throw new Error("Submission not found");
            }

            const questionBankId = submission.exam_snapshot?.questionBankId;

            // Load questions with correct answers
            const { data: questions, error: questionsError } = await supabase
                .from("questions")
                .select("id, question_text, correct_option_index, marks")
                .eq("question_bank_id", questionBankId);

            if (questionsError) {
                throw new Error("Failed to load questions");
            }

            // Calculate score
            const sessionAnswers = session.answers || {};
            let score = 0;
            let correctAnswers = 0;
            let incorrectAnswers = 0;
            const submissionAnswers: {
                submission_id: string;
                question_id: string;
                question_text: string;
                selected_option_index: number;
                correct_option_index: number;
                is_correct: boolean;
                marks: number;
                answered_at: string | null;
            }[] = [];

            for (const question of questions || []) {
                const userAnswer = sessionAnswers[question.id];
                const selectedIndex = userAnswer?.selected_option_index ?? -1;
                const isCorrect = selectedIndex === question.correct_option_index;

                if (selectedIndex >= 0) {
                    if (isCorrect) {
                        score += question.marks;
                        correctAnswers++;
                    } else {
                        incorrectAnswers++;
                    }

                    submissionAnswers.push({
                        submission_id: session.submission_id,
                        question_id: question.id,
                        question_text: question.question_text,
                        selected_option_index: selectedIndex,
                        correct_option_index: question.correct_option_index,
                        is_correct: isCorrect,
                        marks: isCorrect ? question.marks : 0,
                        answered_at: userAnswer?.answered_at
                            ? new Date(userAnswer.answered_at).toISOString()
                            : null,
                    });
                }
            }

            const totalQuestions = questions?.length || 0;
            const unanswered = totalQuestions - (correctAnswers + incorrectAnswers);

            // Calculate time taken
            const startTime = new Date(session.start_time).getTime();
            const now = Date.now();
            const timeTaken = Math.floor((now - startTime) / 1000);

            // Insert submission answers
            if (submissionAnswers.length > 0) {
                const { error: answersError } = await supabase
                    .from("submission_answers")
                    .insert(submissionAnswers);

                if (answersError) {
                    console.error("Error inserting answers:", answersError);
                }
            }

            // Update submission
            const submittedAt = new Date().toISOString();
            const { error: updateSubError } = await supabase
                .from("submissions")
                .update({
                    score,
                    correct_answers: correctAnswers,
                    incorrect_answers: incorrectAnswers,
                    unanswered,
                    time_taken: timeTaken,
                    submitted_at: submittedAt,
                    status: "completed",
                })
                .eq("id", session.submission_id);

            if (updateSubError) {
                throw new Error("Failed to update submission");
            }

            // Mark session as submitted
            await supabase
                .from("exam_sessions")
                .update({
                    status: "submitted",
                    is_locked: false,
                })
                .eq("id", session.id);

            // Record mock test attempt (only on actual submission)
            if (session.exam_type === "mock-test") {
                // Use upsert to handle edge cases where attempt record might already exist
                await supabase.from("user_mock_test_attempts").upsert(
                    {
                        user_id: session.user_id,
                        mock_test_id: session.exam_id,
                        submission_id: session.submission_id,
                    },
                    { onConflict: "user_id,mock_test_id" }
                );
            }

            const response: SubmitExamResponse = {
                success: true,
                submission_id: session.submission_id,
                exam_type: session.exam_type,
                score,
                total_marks: submission.exam_snapshot?.totalMarks || 0,
                correct_answers: correctAnswers,
                incorrect_answers: incorrectAnswers,
                unanswered,
                time_taken: timeTaken,
            };

            return jsonResponse({ success: true, data: response });
        } catch (innerError) {
            // Unlock session on error
            await supabase
                .from("exam_sessions")
                .update({ is_locked: false })
                .eq("id", session.id);
            throw innerError;
        }
    } catch (error) {
        console.error("exam-submit error:", error);

        // Handle specific errors
        if (error instanceof Error) {
            const message = error.message;
            if (message === "Session token is required") {
                return errorResponse(message, 400);
            }
            if (message === "Session not found or expired") {
                return errorResponse(message, 404);
            }
        }

        return errorResponse(
            error instanceof Error ? error.message : "Internal server error",
            500
        );
    }
});
