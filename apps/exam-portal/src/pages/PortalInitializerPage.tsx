// src/pages/PortalInitializerPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { useInitializeExamQuery, examQueryKeys } from "@/features/exam/api/exam.queries";
import { useExamStore } from "@/features/exam/store/examStore";
import { queryClient } from "@/lib/queryClient";
import type { ExamMetadata, Question } from "@/types/exam.types";

// Loading messages to cycle through
const loadingMessages = [
  "Validating session...",
  "Authenticating user...",
  "Loading exam session...",
  "Preparing questions...",
  "Almost ready...",
];

const MESSAGE_CHANGE_INTERVAL = 1200; // 1.2 seconds

const PortalInitializerPage = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [sessionValidated, setSessionValidated] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionTokenParam = searchParams.get("session");

  const loadExam = useExamStore.use.loadExam();
  const setSessionToken = useExamStore.use.setSessionToken();
  const resetExam = useExamStore.use.resetExam();
  const clearOldSessions = useExamStore.use.clearOldSessions();
  const sessionToken = useExamStore.use.sessionToken();
  const examMetadata = useExamStore.use.examMetadata();
  const questions = useExamStore.use.questions();
  const timeLeft = useExamStore.use.timeLeft();
  const isExamSubmitted = useExamStore.use.isExamSubmitted();
  const hasHydrated = useExamStore.use._hasHydrated();

  // Clear query cache when session token changes (prevents stale data)
  useEffect(() => {
    if (sessionTokenParam && sessionToken && sessionTokenParam !== sessionToken) {
      console.log("[PortalInitializer] New session detected, clearing query cache...");
      queryClient.removeQueries({ queryKey: examQueryKeys.session() });
    }
  }, [sessionTokenParam, sessionToken]);

  // Check for existing persisted session on mount
  useEffect(() => {
    // Wait for hydration before making routing decisions
    if (!hasHydrated) return;

    // If we have a session token in URL, it's a new session request
    if (sessionTokenParam) {
      // Check if the persisted session matches the URL token
      if (sessionToken === sessionTokenParam && examMetadata && questions.length > 0 && timeLeft > 0) {
        // Validate that the stored questions count matches the exam metadata
        if (questions.length !== examMetadata.totalQuestions) {
          console.warn(
            `[PortalInitializer] Question count mismatch: stored ${questions.length}, expected ${examMetadata.totalQuestions}. Fetching fresh data...`
          );
          // Clear stale data and fetch fresh
          resetExam();
          clearOldSessions(sessionTokenParam);
          setSessionToken(sessionTokenParam);
          setShouldFetch(true);
          return;
        }

        // Same session token and valid data - resume existing session
        console.log("[PortalInitializer] Resuming persisted exam session with valid data");
        navigate("/exam");
        return;
      }

      // DIFFERENT session token OR no persisted session - this is a NEW exam
      // We must reset the old session data before fetching new one
      if (sessionToken && sessionToken !== sessionTokenParam) {
        console.log("[PortalInitializer] New session token detected, clearing old session data");
        resetExam();
        clearOldSessions(sessionTokenParam);
        queryClient.removeQueries({ queryKey: examQueryKeys.session() });
      }

      // Set new session token and fetch from API
      setSessionToken(sessionTokenParam);
      setShouldFetch(true);
      return;
    }

    // No session token in URL - check for persisted session
    if (examMetadata && questions.length > 0 && sessionToken) {
      // Validate question count before resuming
      if (questions.length !== examMetadata.totalQuestions) {
        console.warn(
          `[PortalInitializer] Persisted session has question count mismatch. Redirecting to error...`
        );
        navigate("/error?code=INVALID_SESSION&message=Session+data+is+corrupted+or+expired");
        return;
      }

      // Check if session is already over (expired or submitted)
      if (timeLeft <= 0 || isExamSubmitted) {
        console.log("[PortalInitializer] Session already completed, redirecting to completion");
        navigate("/complete");
        return;
      }

      // Resume the persisted session
      console.log("[PortalInitializer] Resuming persisted exam session (no URL token)");
      navigate("/exam");
      return;
    }

    // No persisted session and no URL token - redirect to main platform
    const mainPlatformUrl = import.meta.env.VITE_MAIN_PLATFORM_URL || 'http://localhost:3000';
    console.log("[PortalInitializer] No session found, redirecting to main platform");
    window.location.href = mainPlatformUrl;
  }, [hasHydrated, sessionTokenParam, sessionToken, examMetadata, questions, timeLeft, isExamSubmitted, setSessionToken, resetExam, clearOldSessions, navigate]);

  // Call the initialization API only when we need to fetch
  const { data: response, isLoading, error } = useInitializeExamQuery({
    enabled: shouldFetch && !!(sessionToken || sessionTokenParam),
  });

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, MESSAGE_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle success: load exam into store and navigate to instructions
  useEffect(() => {
    if (!response?.success || !response.data) return;

    const examData = response.data;

    // Validate question count from server
    if (examData.questions.length !== examData.totalQuestions) {
      console.error(
        `[PortalInitializer] Server returned question count mismatch: ` +
        `${examData.questions.length} questions but totalQuestions=${examData.totalQuestions}`
      );
      navigate(`/error?code=INVALID_DATA&message=Question+count+mismatch+from+server`);
      return;
    }

    // Transform backend response into store format
    const metadata: ExamMetadata = {
      examSessionId: examData.examSessionId,
      submissionId: examData.submissionId,
      examType: examData.examType,
      examId: examData.examId,
      examTitle: examData.examTitle,
      durationMinutes: examData.durationMinutes,
      duration: examData.durationMinutes, // Temp compatibility
      totalQuestions: examData.totalQuestions,
      startTime: examData.startTime,
      endTime: examData.endTime,
    };

    // Use the already-mapped questions directly from the API
    // These include type, operations, operatorType for abacus vertical display
    const mappedQuestions = examData.questions;

    // Load into Zustand store with saved answers, time remaining, and resume state
    loadExam(
      metadata,
      mappedQuestions,
      examData.savedAnswers, // Restore previous answers if any
      examData.timeRemaining, // Use remaining time for resumed sessions
      {
        lastQuestionIndex: examData.lastQuestionIndex,
        markedQuestions: examData.savedMarkedQuestions,
      }
    );

    // If there are saved answers, go directly to exam (resume mode)
    // Otherwise, show instructions first
    const hasSavedAnswers = examData.savedAnswers && Object.keys(examData.savedAnswers).length > 0;
    navigate(hasSavedAnswers ? "/exam" : "/instructions");
  }, [response, loadExam, navigate]);

  // Handle error: navigate to error page with appropriate code
  useEffect(() => {
    if (!error) return;

    // Extract error message or use generic fallback
    const errorMessage =
      (error as Error)?.message || "Failed to initialize exam session";

    // Determine error code based on message
    let errorCode = "INITIALIZATION_FAILED";
    if (errorMessage.toLowerCase().includes("expired")) errorCode = "SESSION_EXPIRED";
    if (errorMessage.toLowerCase().includes("not found")) errorCode = "SESSION_NOT_FOUND";
    if (errorMessage.toLowerCase().includes("time")) errorCode = "EXAM_NOT_AVAILABLE";
    if (errorMessage.toLowerCase().includes("unauthorized")) errorCode = "UNAUTHORIZED";
    if (errorMessage.toLowerCase().includes("already attempted")) errorCode = "ALREADY_ATTEMPTED";
    if (errorMessage.toLowerCase().includes("grade")) errorCode = "GRADE_MISMATCH";

    navigate(
      `/error?code=${errorCode}&message=${encodeURIComponent(errorMessage)}`
    );
  }, [error, navigate]);

  return (
    <PortalLayout>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            {isLoading ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Initializing Exam Portal
                </CardTitle>
              </>
            ) : error ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-bold text-destructive">
                  Initialization Failed
                </CardTitle>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">
                  Ready!
                </CardTitle>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading && (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  {loadingMessages[currentMessageIndex]}
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Please wait while we prepare your exam session...
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Redirecting to error page...
                </p>
              </div>
            )}

            {response?.success && (
              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Redirecting to instructions...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default PortalInitializerPage;
