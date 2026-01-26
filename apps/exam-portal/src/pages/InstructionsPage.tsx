// src/pages/InstructionsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, ListChecks, ShieldCheck, AlertCircle } from "lucide-react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { useExamStore } from "@/features/exam/store/examStore";

const AUTO_START_SECONDS = 45;

const DEFAULT_INSTRUCTIONS = [
  "This is a timed exam. Please ensure you complete it in one sitting.",
  "The exam consists of multiple-choice questions (MCQs).",
  "Each question has only one correct answer.",
  "You can navigate between questions using the palette or next/previous buttons.",
  "Answers are saved automatically when you select an option.",
  "Do not close the browser window or refresh the page during the exam.",
  "The exam will be submitted automatically when the time runs out.",
  "You cannot pause or restart the exam once started.",
];

const InstructionsPage = () => {
  const [countdown, setCountdown] = useState(AUTO_START_SECONDS);
  const navigate = useNavigate();

  // Get exam metadata from store (loaded by PortalInitializerPage)
  const examMetadata = useExamStore.use.examMetadata();
  const questions = useExamStore.use.questions();

  const handleStartExam = useCallback(() => {
    navigate("/exam");
  }, [navigate]);

  // Safety check: redirect if exam data is missing
  useEffect(() => {
    if (!examMetadata || questions.length === 0) {
      // Store not loaded → user accessed /instructions directly or session lost
      navigate(
        "/error?code=MISSING_SESSION&message=No+active+exam+session+found"
      );
    }
  }, [examMetadata, questions, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === 0) {
      handleStartExam();
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown, handleStartExam]);

  // If store is empty, show loading state (brief moment before redirect)
  if (!examMetadata || questions.length === 0) {
    return (
      <PortalLayout>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                No Active Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                Redirecting to error page...
              </p>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {examMetadata.examTitle}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Exam Info Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-lg font-bold">
                    {examMetadata.durationMinutes} Minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <ListChecks className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Questions</p>
                  <p className="text-lg font-bold">
                    {examMetadata.totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Format</p>
                  <p className="text-lg font-bold">MCQ</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Instructions to Candidates:
              </h3>
              <ul className="space-y-2">
                {DEFAULT_INSTRUCTIONS.map((inst, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notice */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                ⚠️ Important: Once you start the exam, the timer will begin
                immediately. Make sure you are ready and have a stable internet
                connection.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleStartExam}
              size="lg"
              className="w-full text-base font-semibold"
            >
              Start Exam Now
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Exam will start automatically in{" "}
              <span className="font-bold text-primary">{countdown}</span>{" "}
              seconds
            </p>
          </CardFooter>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default InstructionsPage;
