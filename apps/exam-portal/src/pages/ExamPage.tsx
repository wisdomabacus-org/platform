// src/pages/ExamPage.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useExamStore } from "@/features/exam/store/examStore";
import { useExamTimer } from "@/features/exam/hooks/useExamTimer";
import { useExamNavigation } from "@/features/exam/hooks/useExamNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubmitAnswerMutation } from "@/features/exam/api/exam.queries";

// Components
import { ExamHeader } from "@/features/exam/components/ExamHeader";
import { ExamFooter } from "@/features/exam/components/ExamFooter";
import { QuestionContent } from "@/features/exam/components/QuestionContent";
import { QuestionPalette } from "@/features/exam/components/QuestionPalette";
import { QuestionNavigator } from "@/features/exam/components/QuestionNavigator";
import { SubmitDialog } from "@/features/exam/components/SubmitDialog";
import { ExamLegend } from "@/features/exam/components/ExamLegend";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ExamPage = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Store selectors (no prop drilling!)
  const examMetadata = useExamStore.use.examMetadata();
  const questions = useExamStore.use.questions();
  const currentQuestion = useExamStore.use.currentQuestion();
  const answers = useExamStore.use.answers();
  const markedQuestions = useExamStore.use.markedQuestions();
  const setAnswer = useExamStore.use.setAnswer();
  const toggleMarkForReview = useExamStore.use.toggleMarkForReview();

  // Hooks
  const { timeLeft, isTimeUp } = useExamTimer();
  const {
    totalQuestions,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    handleQuestionSelect,
  } = useExamNavigation();

  // API mutation for saving answers
  const { mutate: submitAnswerToBackend } = useSubmitAnswerMutation({
    onError: (error) => {
      // Silent fail - answer is already saved in Zustand optimistically
      console.error("Failed to save answer to backend:", error);
    },
  });

  // Safety check: redirect if no exam data
  // The PortalInitializerPage will handle checking for persisted session
  useEffect(() => {
    if (!examMetadata || questions.length === 0) {
      // Redirect to home which will check for persisted session
      navigate("/");
    }
  }, [examMetadata, questions, navigate]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (isTimeUp && !showSubmitDialog) {
      setShowSubmitDialog(true);
    }
  }, [isTimeUp, showSubmitDialog]);

  // Get current question data
  const currentQuestionData = useMemo(() => {
    if (!questions.length) return null;
    return questions[currentQuestion - 1]; // currentQuestion is 1-based
  }, [questions, currentQuestion]);

  // Get selected answer for current question
  const selectedAnswer = useMemo(() => {
    if (!currentQuestionData) return null;
    return answers.get(currentQuestionData.id) ?? null;
  }, [answers, currentQuestionData]);

  // Check if current question is marked
  const isCurrentMarked = useMemo(() => {
    if (!currentQuestionData) return false;
    return markedQuestions.has(currentQuestionData.id);
  }, [markedQuestions, currentQuestionData]);

  // Handle answer selection (optimistic update + API call)
  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      if (!currentQuestionData) return;

      // 1. Optimistic update in store
      setAnswer(currentQuestionData.id, answerIndex);

      // 2. Save to backend
      submitAnswerToBackend({
        questionId: currentQuestionData.id,
        selectedOptionIndex: answerIndex,
      });
    },
    [currentQuestionData, setAnswer, submitAnswerToBackend]
  );

  // Handle mark for review toggle
  const handleMarkToggle = useCallback(() => {
    if (currentQuestionData) {
      toggleMarkForReview(currentQuestionData.id);
    }
  }, [currentQuestionData, toggleMarkForReview]);

  // Handle palette question click (number-based)
  const handleQuestionClickByNumber = useCallback(
    (questionNumber: number) => {
      handleQuestionSelect(questionNumber);
      setIsPaletteOpen(false);
    },
    [handleQuestionSelect]
  );

  // Convert answers and marked from string IDs to number indexes for components
  const answeredQuestionsSet = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, idx) => {
      if (answers.has(q.id)) {
        set.add(idx + 1); // 1-based index
      }
    });
    return set;
  }, [answers, questions]);

  const markedQuestionsSet = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, idx) => {
      if (markedQuestions.has(q.id)) {
        set.add(idx + 1); // 1-based index
      }
    });
    return set;
  }, [markedQuestions, questions]);

  // Submission handler
  const handleSubmitClick = useCallback(() => {
    setShowSubmitDialog(true);
  }, []);

  // Confirm submission (will be wired to useExamSubmit hook)
  const handleConfirmSubmit = useCallback(() => {
    // TODO: Wire this to useExamSubmit mutation in next step
    console.log("Submitting exam...");
    navigate("/completion");
  }, [navigate]);

  // Show error state if no data
  if (!examMetadata || !currentQuestionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Exam Not Loaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting to error page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header with timer and title */}
      <ExamHeader
        timeLeft={timeLeft}
        onSubmit={handleSubmitClick}
        onMenuClick={() => setIsPaletteOpen(true)}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question content (left side on desktop, full on mobile) */}
        <QuestionContent
          question={currentQuestionData}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Question palette (right sidebar on desktop, sheet on mobile) */}
        {!isMobile ? (
          <aside className="hidden w-80 flex-col border-l bg-card md:flex">
            <div className="flex-1 overflow-y-auto p-4">
              <QuestionPalette
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                answeredQuestions={answeredQuestionsSet}
                markedQuestions={markedQuestionsSet}
                onQuestionSelect={handleQuestionSelect}
              />
              <div className="mt-6">
                <ExamLegend />
              </div>
            </div>
          </aside>
        ) : (
          <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Question Palette</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex-1 overflow-y-auto">
                <QuestionPalette
                  totalQuestions={totalQuestions}
                  currentQuestion={currentQuestion}
                  answeredQuestions={answeredQuestionsSet}
                  markedQuestions={markedQuestionsSet}
                  onQuestionSelect={handleQuestionClickByNumber}
                  isCompact={true}
                />
                <div className="mt-6">
                  <ExamLegend />
                </div>
              </div>
              <SheetFooter className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsPaletteOpen(false)}
                >
                  Close
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Navigation footer */}
      <ExamFooter
        onMarkForReview={handleMarkToggle}
        onPrevious={handlePrevious}
        onSaveAndNext={handleNext}
        canGoBack={canGoPrevious}
        canGoForward={canGoNext}
        isMobile={isMobile}
      />

      {/* Question navigator (mobile bottom bar) */}
      {isMobile && (
        <QuestionNavigator
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          answeredQuestions={answeredQuestionsSet}
          markedQuestions={markedQuestionsSet}
          onQuestionSelect={handleQuestionSelect}
        />
      )}

      {/* Submit confirmation dialog */}
      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={handleConfirmSubmit}
        answeredCount={answeredQuestionsSet.size}
        totalQuestions={totalQuestions}
        markedCount={markedQuestionsSet.size}
      />
    </div>
  );
};

export default ExamPage;
