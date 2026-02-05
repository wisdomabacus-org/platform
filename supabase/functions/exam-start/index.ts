// supabase/functions/exam-start/index.ts
// Start an exam session (competition or mock test)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, requireAuth } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import type { ExamType, Competition, UserProfile } from "../_shared/types.ts";

interface StartExamRequest {
    exam_type: ExamType;
    exam_id: string;
}

interface StartExamResponse {
    session_token: string;
    submission_id: string;
    exam_title: string;
    duration_minutes: number;
    total_questions: number;
    start_time: number;
    end_time: number;
}

serve(async (req: Request) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        // Require authentication
        const user = await requireAuth(req);
        const supabase = createServiceClient();

        // Parse request body
        const body: StartExamRequest = await req.json();
        const { exam_type, exam_id } = body;

        if (!exam_type || !exam_id) {
            return errorResponse("exam_type and exam_id are required", 400);
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return errorResponse("User profile not found", 404);
        }

        const userProfile = profile as UserProfile;

        // Check for existing submission
        const existingQuery = supabase
            .from("submissions")
            .select("id, status")
            .eq("user_id", user.id)
            .eq("exam_type", exam_type);

        if (exam_type === "competition") {
            existingQuery.eq("competition_id", exam_id);
        } else {
            existingQuery.eq("mock_test_id", exam_id);
        }

        const { data: existingSubmission } = await existingQuery.single();

        // If submission exists, check if we can resume or if it's already submitted
        if (existingSubmission) {
            if (existingSubmission.status === "submitted" || existingSubmission.status === "graded") {
                return errorResponse("You have already attempted this exam", 409);
            }

            // Check for existing session that is still valid
            const { data: existingSession } = await supabase
                .from("exam_sessions")
                .select("*")
                .eq("submission_id", existingSubmission.id)
                .eq("status", "in-progress")
                .single();

            if (existingSession) {
                const now = Date.now();
                const endTime = new Date(existingSession.end_time).getTime();

                // If session is still valid (not expired), return it for resumption
                if (now < endTime) {
                    const timeRemaining = Math.floor((endTime - now) / 1000);

                    // Get exam title from submission
                    const { data: submission } = await supabase
                        .from("submissions")
                        .select("exam_snapshot, total_questions")
                        .eq("id", existingSubmission.id)
                        .single();

                    const response: StartExamResponse = {
                        session_token: existingSession.session_token,
                        submission_id: existingSubmission.id,
                        exam_title: submission?.exam_snapshot?.title || "Exam",
                        duration_minutes: existingSession.duration_minutes,
                        total_questions: submission?.total_questions || 0,
                        start_time: new Date(existingSession.start_time).getTime(),
                        end_time: endTime,
                    };

                    return jsonResponse({
                        success: true,
                        data: response,
                        message: "Resuming existing session",
                    });
                }

                // Session has expired - mark it and create new error
                await supabase
                    .from("exam_sessions")
                    .update({ status: "expired" })
                    .eq("id", existingSession.id);

                return errorResponse("Your previous session has expired", 410);
            }

            // No valid session but submission exists in-progress state
            // Instead of throwing error, create a new session for this submission
            // This improves UX - user can continue their exam

            console.log("Creating new session for existing in-progress submission:", existingSubmission.id);

            // Get the original exam details to recreate the session
            const { data: existingSubDetails, error: subDetailsError } = await supabase
                .from("submissions")
                .select("exam_snapshot, total_questions, started_at")
                .eq("id", existingSubmission.id)
                .single();

            if (subDetailsError || !existingSubDetails) {
                return errorResponse("Failed to retrieve submission details", 500);
            }

            const examSnapshot = existingSubDetails.exam_snapshot;
            const durationMinutes = examSnapshot?.durationMinutes || 60;

            // Calculate new session times
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
            const expiresAt = new Date(endTime.getTime() + 15 * 60 * 1000); // 15 min buffer
            const sessionToken = crypto.randomUUID();

            // Create new exam session for existing submission
            const { error: newSessionError } = await supabase.from("exam_sessions").insert({
                session_token: sessionToken,
                user_id: user.id,
                exam_type,
                exam_id,
                submission_id: existingSubmission.id,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                duration_minutes: durationMinutes,
                answers: {}, // Start fresh with answers (previous ones weren't saved)
                status: "in-progress",
                is_locked: false,
                expires_at: expiresAt.toISOString(),
            });

            if (newSessionError) {
                console.error("Session creation error:", newSessionError);
                return errorResponse("Failed to create exam session", 500);
            }

            const resumeResponse: StartExamResponse = {
                session_token: sessionToken,
                submission_id: existingSubmission.id,
                exam_title: examSnapshot?.title || "Exam",
                duration_minutes: durationMinutes,
                total_questions: existingSubDetails.total_questions || 0,
                start_time: startTime.getTime(),
                end_time: endTime.getTime(),
            };

            return jsonResponse({
                success: true,
                data: resumeResponse,
                message: "Session recreated for existing submission",
            });
        }

        // Validate access based on exam type
        let examDetails: {
            title: string;
            duration: number;
            total_questions: number;
            total_marks: number;
            question_bank_id: string;
        };

        if (exam_type === "competition") {
            // Check enrollment
            const { data: enrollment, error: enrollError } = await supabase
                .from("enrollments")
                .select("*")
                .eq("user_id", user.id)
                .eq("competition_id", exam_id)
                .eq("status", "confirmed")
                .eq("is_payment_confirmed", true)
                .single();

            if (enrollError || !enrollment) {
                return errorResponse("You are not enrolled in this competition", 403);
            }

            // Get competition details
            const { data: competition, error: compError } = await supabase
                .from("competitions")
                .select("*")
                .eq("id", exam_id)
                .eq("is_published", true)
                .single();

            if (compError || !competition) {
                return errorResponse("Competition not found", 404);
            }

            const comp = competition as Competition;
            const now = new Date();
            const windowStart = new Date(comp.exam_window_start);
            const windowEnd = new Date(comp.exam_window_end);

            if (now < windowStart) {
                return errorResponse("Exam has not started yet", 403);
            }
            if (now > windowEnd) {
                return errorResponse("Exam window has closed", 403);
            }

            // Get question bank for user's grade
            const { data: qbConfig, error: qbConfigError } = await supabase
                .from("competition_question_banks")
                .select("question_bank_id, grades")
                .eq("competition_id", exam_id);

            if (qbConfigError || !qbConfig?.length) {
                return errorResponse("No question bank configured", 500);
            }

            const userGrade = userProfile.student_grade || 0;
            const matchingQb = qbConfig.find((qb: { grades: number[] }) =>
                qb.grades.includes(userGrade)
            );

            if (!matchingQb) {
                return errorResponse(`No question bank for grade ${userGrade}`, 404);
            }

            // Get question count
            const { count: questionCount } = await supabase
                .from("questions")
                .select("*", { count: "exact", head: true })
                .eq("question_bank_id", matchingQb.question_bank_id);

            examDetails = {
                title: comp.title,
                duration: comp.duration,
                total_questions: questionCount || 0,
                total_marks: comp.total_marks,
                question_bank_id: matchingQb.question_bank_id,
            };
        } else {
            // Mock test
            const { data: mockTest, error: mtError } = await supabase
                .from("mock_tests")
                .select("*")
                .eq("id", exam_id)
                .eq("is_published", true)
                .single();

            if (mtError || !mockTest) {
                return errorResponse("Mock test not found", 404);
            }

            // Check if already attempted
            const { data: attempt } = await supabase
                .from("user_mock_test_attempts")
                .select("id")
                .eq("user_id", user.id)
                .eq("mock_test_id", exam_id)
                .single();

            if (attempt) {
                return errorResponse("You have already attempted this mock test", 409);
            }

            // Check grade eligibility
            const userGrade = userProfile.student_grade || 0;
            if (userGrade < mockTest.min_grade || userGrade > mockTest.max_grade) {
                return errorResponse(
                    `This mock test is for grades ${mockTest.min_grade}-${mockTest.max_grade}`,
                    403
                );
            }

            // Get question bank
            const { data: qbConfig } = await supabase
                .from("mock_test_question_banks")
                .select("question_bank_id, grades")
                .eq("mock_test_id", exam_id);

            if (!qbConfig?.length) {
                return errorResponse("No question bank configured", 500);
            }

            const matchingQb = qbConfig.find((qb: { grades: number[] }) =>
                qb.grades.includes(userGrade)
            );

            if (!matchingQb) {
                return errorResponse(`No question bank for grade ${userGrade}`, 404);
            }

            const { count: questionCount } = await supabase
                .from("questions")
                .select("*", { count: "exact", head: true })
                .eq("question_bank_id", matchingQb.question_bank_id);

            examDetails = {
                title: mockTest.title,
                duration: mockTest.duration,
                total_questions: questionCount || 0,
                total_marks: mockTest.total_questions, // Assuming 1 mark per question
                question_bank_id: matchingQb.question_bank_id,
            };
        }

        // Create submission record
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + examDetails.duration * 60 * 1000);

        const { data: submission, error: subError } = await supabase
            .from("submissions")
            .insert({
                user_id: user.id,
                exam_type,
                competition_id: exam_type === "competition" ? exam_id : null,
                mock_test_id: exam_type === "mock-test" ? exam_id : null,
                exam_snapshot: {
                    title: examDetails.title,
                    durationMinutes: examDetails.duration,
                    totalMarks: examDetails.total_marks,
                    questionBankId: examDetails.question_bank_id,
                },
                total_questions: examDetails.total_questions,
                started_at: startTime.toISOString(),
                status: "in-progress",
            })
            .select()
            .single();

        if (subError || !submission) {
            console.error("Submission creation error:", subError);
            return errorResponse("Failed to create submission", 500);
        }

        // Generate session token
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(endTime.getTime() + 15 * 60 * 1000); // 15 min buffer

        // Create exam session
        const { error: sessionError } = await supabase.from("exam_sessions").insert({
            session_token: sessionToken,
            user_id: user.id,
            exam_type,
            exam_id,
            submission_id: submission.id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration_minutes: examDetails.duration,
            answers: {},
            status: "in-progress",
            is_locked: false,
            expires_at: expiresAt.toISOString(),
        });

        if (sessionError) {
            console.error("Session creation error:", sessionError);
            return errorResponse("Failed to create exam session", 500);
        }

        // Record mock test attempt if applicable
        if (exam_type === "mock-test") {
            await supabase.from("user_mock_test_attempts").insert({
                user_id: user.id,
                mock_test_id: exam_id,
                submission_id: submission.id,
            });
        }

        // Update enrollment with submission ID if competition
        if (exam_type === "competition") {
            await supabase
                .from("enrollments")
                .update({ submission_id: submission.id })
                .eq("user_id", user.id)
                .eq("competition_id", exam_id);
        }

        const response: StartExamResponse = {
            session_token: sessionToken,
            submission_id: submission.id,
            exam_title: examDetails.title,
            duration_minutes: examDetails.duration,
            total_questions: examDetails.total_questions,
            start_time: startTime.getTime(),
            end_time: endTime.getTime(),
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("exam-start error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
