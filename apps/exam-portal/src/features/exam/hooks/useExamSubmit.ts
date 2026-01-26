import { useCallback } from "react";
import { useExamStore } from "../store/examStore";
import { useToast } from "@/hooks/use-toast";

export const useExamSubmit = () => {
  const questions = useExamStore.use.questions();
  const answers = useExamStore.use.answers();
  const markedQuestions = useExamStore.use.markedQuestions();
  const submitExam = useExamStore.use.submitExam();
  const { toast } = useToast();

  const handleSubmit = useCallback(() => {
    const score = Array.from(answers.entries()).reduce((acc, [qId, ansIdx]) => {
      const question = questions.find((q) => q.id === qId);
      return acc + (question?.correctAnswer === ansIdx ? 1 : 0);
    }, 0);

    submitExam();

    toast({
      title: "Exam Submitted Successfully!",
      description: `You scored ${score} out of ${questions.length}`,
      duration: 10000,
    });
  }, [answers, questions, submitExam, toast]);

  return {
    handleSubmit,
    answeredCount: answers.size,
    unansweredCount: questions.length - answers.size,
    markedCount: markedQuestions.size,
    totalQuestions: questions.length,
  };
};
