// supabase/functions/exam-start/index.ts
// Start an exam session (competition or mock test)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
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

/**
 * Get the authenticated user from the request
 * This version is more lenient and provides detailed error logging
 */
async function getAuthUser(req: Request): Promise<{ id: string; email?: string } | null> {
    const authHeader = req.headers.get("Authorization");

    console.log("Auth header present:", !!authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
        console.error("Missing or invalid Authorization header");
        return null;
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServiceClient();

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error) {
            console.error("Auth validation error:", error.message);
            return null;
        }

        if (!user) {
            console.error("No user found for token");
            return null;
        }

        console.log("Authenticated user:", user.id);
        return {
            id: user.id,
            email: user.email,
        };
    } catch (e) {
        console.error("Exception during auth validation:", e);
        return null;
    }
}

/**
 * Require authentication - throws if not authenticated
 */
async function requireAuth(req: Request): Promise<{ id: string; email?: string }> {
    const user = await getAuthUser(req);
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

/**
 * Validate that question bank grade range is compatible with mock test grade range
 */
function validateGradeCompatibility(
    mockTestMinGrade: number,
    mockTestMaxGrade: number,
    qbMinGrade: number | null,
    qbMaxGrade: number | null,
    assignedGrades: number[]
): { valid: boolean; error?: string } {
    // Check if question bank grades overlap with mock test grades
    const qbMin = qbMinGrade ?? 0;
    const qbMax = qbMaxGrade ?? 12;

    // Check if there's any overlap
    const hasOverlap = !(qbMax < mockTestMinGrade || qbMin > mockTestMaxGrade);

    if (!hasOverlap) {
        return {
            valid: false,
            error: `Question bank grades (${qbMin}-${qbMax}) don't overlap with mock test grades (${mockTestMinGrade}-${mockTestMaxGrade})`
        };
    }

    // Check if assigned grades are within mock test range
    const invalidGrades = assignedGrades.filter(
        g => g < mockTestMinGrade || g > mockTestMaxGrade
    );

    if (invalidGrades.length > 0) {
        return {
            valid: false,
            error: `Question bank assigned for grades [${invalidGrades.join(",")}] but mock test only supports grades ${mockTestMinGrade}-${mockTestMaxGrade}`
        };
    }

    return { valid: true };
}

/**
 * Validate question count matches expected total
 */
function validateQuestionCount(
    expectedCount: number,
    actualCount: number,
    questionBankTitle: string
): { valid: boolean; error?: string } {
    if (actualCount === 0) {
        return {
            valid: false,
            error: `Question bank "${questionBankTitle}" has no questions. Please contact support.`
        };
    }

    if (actualCount < expectedCount) {
        return {
            valid: false,
            error: `Question bank "${questionBankTitle}" has only ${actualCount} questions, but this test requires ${expectedCount}. Please contact support.`
        };
    }

    if (actualCount > expectedCount) {
        console.warn(
            `Question bank "${questionBankTitle}" has ${actualCount} questions, ` +
            `but mock test expects ${expectedCount}. ` +
            `Only the first ${expectedCount} questions will be used.`
        );
    }

    return { valid: true };
}

serve(async (req: Request) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        console.log("=== exam-start called ===");
        console.log("Request method:", req.method);
        console.log("Request headers:", Object.fromEntries(req.headers.entries()));

        // Require authentication
        let user;
        try {
            user = await requireAuth(req);
        } catch (authError) {
            console.error("Authentication failed:", authError);
            return errorResponse("Unauthorized - Please login again", 401);
        }

        const supabase = createServiceClient();

        // Parse request body
        let body: StartExamRequest;
        try {
            body = await req.json();
        } catch (e) {
            console.error("Failed to parse request body:", e);
            return errorResponse("Invalid JSON in request body", 400);
        }

        const { exam_type, exam_id } = body;
        console.log("Request body:", { exam_type, exam_id, user_id: user.id });

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
            console.error("Profile fetch error:", profileError);
            return errorResponse("User profile not found", 404);
        }

        const userProfile = profile as UserProfile;
        console.log("User profile found:", {
            id: userProfile.id,
            student_grade: userProfile.student_grade,
            student_name: userProfile.student_name
        });

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
            console.log("Existing submission found:", existingSubmission);

            if (existingSubmission.status === "completed" || existingSubmission.status === "auto-submitted") {
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

                    console.log("Resuming existing session");
                    return jsonResponse({
                        success: true,
                        data: response,
                        message: "Resuming existing session",
                    });
                }

                // Session has expired - mark it and allow creating a new session
                // This handles edge cases where student's browser crashed or network failed
                await supabase
                    .from("exam_sessions")
                    .update({ status: "expired" })
                    .eq("id", existingSession.id);

                console.log("Existing session expired, will create new session for in-progress submission");
                // Continue to create new session logic below (submission is still in-progress)
                // Fall through to the "no valid session" block
            }

            // No valid session but submission exists in-progress state
            console.log("Creating new session for existing in-progress submission:", existingSubmission.id);

            // For competitions, validate that exam window is still open before allowing restart
            if (exam_type === "competition") {
                const { data: competition, error: compError } = await supabase
                    .from("competitions")
                    .select("exam_window_start, exam_window_end")
                    .eq("id", exam_id)
                    .single();

                if (compError || !competition) {
                    return errorResponse("Competition not found", 404);
                }

                const now = new Date();
                const windowEnd = new Date(competition.exam_window_end);

                if (now > windowEnd) {
                    return errorResponse("Exam window has closed. You can no longer restart this exam.", 403);
                }
            }

            // Get the original exam details to recreate the session
            const { data: existingSubDetails, error: subDetailsError } = await supabase
                .from("submissions")
                .select("exam_snapshot, total_questions, started_at")
                .eq("id", existingSubmission.id)
                .single();

            if (subDetailsError || !existingSubDetails) {
                console.error("Failed to retrieve submission details:", subDetailsError);
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
                answers: {},
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

            console.log("New session created for existing submission");
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
            console.log("Processing competition exam start");

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
                console.error("Enrollment check failed:", enrollError);
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
                console.error("Competition fetch error:", compError);
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
                console.error("Question bank config error:", qbConfigError);
                return errorResponse("No question bank configured", 500);
            }

            const userGrade = userProfile.student_grade || 0;
            const matchingQb = qbConfig.find((qb: { grades: number[] }) =>
                qb.grades.includes(userGrade)
            );

            if (!matchingQb) {
                return errorResponse(`No question bank for grade ${userGrade}`, 404);
            }

            // Get question bank details for grade validation
            const { data: qbDetails } = await supabase
                .from("question_banks")
                .select("min_grade, max_grade, title")
                .eq("id", matchingQb.question_bank_id)
                .single();

            // Validate grade compatibility
            const gradeValidation = validateGradeCompatibility(
                comp.min_grade,
                comp.max_grade,
                qbDetails?.min_grade ?? null,
                qbDetails?.max_grade ?? null,
                matchingQb.grades
            );

            if (!gradeValidation.valid) {
                console.error("Grade compatibility error:", gradeValidation.error);
                return errorResponse(gradeValidation.error || "Grade configuration error", 500);
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
            console.log("Processing mock test exam start");

            // Mock test
            const { data: mockTest, error: mtError } = await supabase
                .from("mock_tests")
                .select("*")
                .eq("id", exam_id)
                .eq("is_published", true)
                .single();

            if (mtError || !mockTest) {
                console.error("Mock test fetch error:", mtError);
                return errorResponse("Mock test not found", 404);
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
                return errorResponse("No question bank configured for this mock test. Please contact support.", 500);
            }

            const matchingQb = qbConfig.find((qb: { grades: number[] }) =>
                qb.grades.includes(userGrade)
            );

            if (!matchingQb) {
                return errorResponse(`No question bank for grade ${userGrade}`, 404);
            }

            // Get question bank details for validation
            const { data: qbDetails } = await supabase
                .from("question_banks")
                .select("min_grade, max_grade, title")
                .eq("id", matchingQb.question_bank_id)
                .single();

            // Validate grade compatibility
            const gradeValidation = validateGradeCompatibility(
                mockTest.min_grade,
                mockTest.max_grade,
                qbDetails?.min_grade ?? null,
                qbDetails?.max_grade ?? null,
                matchingQb.grades
            );

            if (!gradeValidation.valid) {
                console.error("Grade compatibility error:", gradeValidation.error);
                return errorResponse(gradeValidation.error || "Grade configuration error", 500);
            }

            // Get actual question count from the bank
            const { count: questionCount } = await supabase
                .from("questions")
                .select("*", { count: "exact", head: true })
                .eq("question_bank_id", matchingQb.question_bank_id);

            // Validate question count matches expected
            const countValidation = validateQuestionCount(
                mockTest.total_questions,
                questionCount || 0,
                qbDetails?.title || "Unknown"
            );

            if (!countValidation.valid) {
                console.error("Question count validation failed:", countValidation.error);
                return errorResponse(countValidation.error || "Question bank configuration error", 500);
            }

            examDetails = {
                title: mockTest.title,
                duration: mockTest.duration,
                total_questions: mockTest.total_questions, // Use expected count, not actual
                total_marks: mockTest.total_questions,
                question_bank_id: matchingQb.question_bank_id,
            };
        }

        console.log("Exam details:", examDetails);

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
                    expectedQuestionCount: examDetails.total_questions, // Store expected count for validation
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

        // Note: Mock test attempt record is created on submission, not here.
        // This allows users to resume if they close the tab before submitting.

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

        console.log("Exam started successfully:", { session_token: sessionToken });
        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("exam-start error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized - Please login again", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
