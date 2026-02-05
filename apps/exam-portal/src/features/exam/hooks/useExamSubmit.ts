import { useCallback, useState } from "react";
import { useExamStore } from "../store/examStore";
import { examApi } from "../api/exam.service";
import { useMutation } from "@tanstack/react-query";
import type { SubmitExamResponse } from "@/types/exam.types";
import type { ApiResponse } from "@/types/api.types";

export const useExamSubmit = () => {
  const questions = useExamStore.use.questions();
  const answers = useExamStore.use.answers();
  const markedQuestions = useExamStore.use.markedQuestions();
  const submitExamStore = useExamStore.use.submitExam();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation to call the exam-submit Edge Function
  const submitMutation = useMutation<
    ApiResponse<SubmitExamResponse>,
    Error,
    void
  >({
    mutationFn: () => examApi.submitExam(),
    onSuccess: () => {
      // Mark exam as submitted in local store
      submitExamStore();
    },
    onError: (error) => {
      console.error("Failed to submit exam:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = useCallback(async (): Promise<SubmitExamResponse | null> => {
    setIsSubmitting(true);
    try {
      const result = await submitMutation.mutateAsync();
      return result.data;
    } catch (error) {
      console.error("Submit error:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitMutation]);

  // Safely get counts
  const answeredCount = answers instanceof Map ? answers.size : 0;
  const markedCount = markedQuestions instanceof Set ? markedQuestions.size : 0;

  return {
    handleSubmit,
    isSubmitting: isSubmitting || submitMutation.isPending,
    answeredCount,
    unansweredCount: questions.length - answeredCount,
    markedCount,
    totalQuestions: questions.length,
    error: submitMutation.error,
  };
};
