// src/pages/CompletionPage.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, Award, AlertCircle } from "lucide-react";
import { useExamStore } from "@/features/exam/store/examStore";
import { useSubmissionQuery } from "@/features/exam/api/submissions.queries";

const AUTO_REDIRECT_SECONDS = 45;
const MAIN_PLATFORM_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://wisdomabacus.com";

// Auto-redirect hook
const useAutoRedirect = (seconds: number, url: string) => {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = url;
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown, url]);

  return countdown;
};

const CompletionPage = () => {
  const [searchParams] = useSearchParams();

  // Try to get submissionId from URL params or store
  const submissionIdFromUrl = searchParams.get("submission");
  const examMetadata = useExamStore.use.examMetadata();
  const resetExam = useExamStore.use.resetExam();
  const submissionId =
    submissionIdFromUrl || examMetadata?.submissionId || null;

  // Clear the exam session on mount (exam is complete)
  useEffect(() => {
    // Small delay to ensure we've captured any needed data first
    const timer = setTimeout(() => {
      resetExam();
    }, 500);
    return () => clearTimeout(timer);
  }, [resetExam]);

  // Fetch submission results
  const { data: response, isLoading, error } = useSubmissionQuery(submissionId);

  // Auto-redirect timer
  const countdown = useAutoRedirect(AUTO_REDIRECT_SECONDS, MAIN_PLATFORM_URL);

  const handleClose = () => {
    window.location.href = MAIN_PLATFORM_URL;
  };

  // Reusable Footer
  const renderFooter = () => (
    <CardFooter className="flex-col gap-4">
      <Button className="w-full" variant="outline" onClick={handleClose}>
        Back to Dashboard
      </Button>
      <p className="text-xs text-muted-foreground">
        You will be redirected automatically in {countdown} seconds...
      </p>
    </CardFooter>
  );

  // Loading state
  if (isLoading) {
    return (
      <PortalLayout className="flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <CardTitle className="pt-4 text-2xl">Loading Results...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we fetch your submission details.
            </p>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  // Error state
  if (error || !response?.success || !response.data) {
    return (
      <PortalLayout className="flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <CardTitle className="pt-4 text-2xl">
              Error Loading Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {response?.message ||
                "Unable to fetch submission results. Please try again later."}
            </p>
          </CardContent>
          {renderFooter()}
        </Card>
      </PortalLayout>
    );
  }

  const submission = response.data;
  const isCompetition = submission.examType === "competition";
  const isMockTest = submission.examType === "mock-test";

  // Competition view (no results shown)
  if (isCompetition) {
    return (
      <PortalLayout className="flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <CardTitle className="pt-4 text-2xl">Exam Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-lg font-semibold">{submission.examTitle}</p>
            <p className="text-muted-foreground">
              Thank you for participating in the competition.
            </p>
            <p className="text-muted-foreground">
              Your answers have been saved. Results will be announced soon on
              the main platform.
            </p>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Submitted At</p>
              <p className="font-medium">
                {new Date(submission.submittedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
          {renderFooter()}
        </Card>
      </PortalLayout>
    );
  }

  // Mock test view (results shown)
  if (isMockTest) {
    const percentageColor =
      submission.percentage >= 80
        ? "text-green-600"
        : submission.percentage >= 60
          ? "text-yellow-600"
          : "text-orange-600";

    return (
      <PortalLayout className="flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <Award className="h-12 w-12 text-primary" />
            <CardTitle className="pt-4 text-2xl">Mock Test Complete!</CardTitle>
            <p className="text-sm text-muted-foreground">
              {submission.examTitle}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Your Score
              </p>
              <p className="text-5xl font-bold">
                {submission.score}
                <span className="text-3xl text-muted-foreground">
                  {" "}
                  / {submission.totalMarks}
                </span>
              </p>
              <p className={`mt-2 text-2xl font-semibold ${percentageColor}`}>
                {submission.percentage.toFixed(1)}%
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-950">
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-green-600">
                  {submission.correctCount}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-950">
                <p className="text-sm text-muted-foreground">Incorrect</p>
                <p className="text-2xl font-bold text-red-600">
                  {submission.incorrectCount}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900">
                <p className="text-sm text-muted-foreground">Unanswered</p>
                <p className="text-2xl font-bold text-gray-600">
                  {submission.unansweredCount}
                </p>
              </div>
            </div>

            {/* Rank (if available) */}
            {submission.rank && (
              <div className="rounded-lg border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold text-primary">
                  #{submission.rank}
                </p>
              </div>
            )}

            {/* Submission Time */}
            <div className="text-center text-sm text-muted-foreground">
              Submitted on{" "}
              {new Date(submission.submittedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </CardContent>
          {renderFooter()}
        </Card>
      </PortalLayout>
    );
  }

  // Fallback (should never reach here)
  return null;
};

export default CompletionPage;
