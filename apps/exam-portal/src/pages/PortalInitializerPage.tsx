// src/pages/PortalInitializerPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { useInitializeExamQuery } from "@/features/exam/api/exam.queries";
import { useExamStore } from "@/features/exam/store/examStore";
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionTokenParam = searchParams.get("session");

  const loadExam = useExamStore.use.loadExam();
  const setSessionToken = useExamStore.use.setSessionToken();
  const sessionToken = useExamStore.use.sessionToken();

  // 1. Sync token from URL to store
  useEffect(() => {
    if (sessionTokenParam) {
      setSessionToken(sessionTokenParam);
      // Clean URL logic could go here
    }
  }, [sessionTokenParam, setSessionToken]);

  // Call the initialization API only when token is available
  const { data: response, isLoading, error } = useInitializeExamQuery({
    enabled: !!(sessionToken || sessionTokenParam),
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

    // Transform questions: ensure both `text` and `questionText` are set
    const questions: Question[] = examData.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      text: q.questionText, // Alias for compatibility
      imageUrl: q.imageUrl,
      options: q.options,
      marks: q.marks,
    }));

    // Load into Zustand store with saved answers and time remaining for session resume
    loadExam(
      metadata,
      questions,
      examData.savedAnswers, // Restore previous answers if any
      examData.timeRemaining // Use remaining time for resumed sessions
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

    // Determine error code based on message (you can customize this)
    let errorCode = "INITIALIZATION_FAILED";
    if (errorMessage.includes("expired")) errorCode = "SESSION_EXPIRED";
    if (errorMessage.includes("not found")) errorCode = "SESSION_NOT_FOUND";
    if (errorMessage.includes("time")) errorCode = "EXAM_NOT_AVAILABLE";

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
