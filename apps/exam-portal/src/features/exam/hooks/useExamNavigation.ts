import { useExamStore } from '../store/examStore';

export const useExamNavigation = () => {
  const currentQuestion = useExamStore.use.currentQuestion();
  const questions = useExamStore.use.questions();
  const setCurrentQuestion = useExamStore.use.setCurrentQuestion();
  const goToNextQuestion = useExamStore.use.goToNextQuestion();
  const goToPreviousQuestion = useExamStore.use.goToPreviousQuestion();

  return {
    currentQuestion,
    totalQuestions: questions.length,
    canGoNext: currentQuestion < questions.length,
    canGoPrevious: currentQuestion > 1,
    handleNext: goToNextQuestion,
    handlePrevious: goToPreviousQuestion,
    handleQuestionSelect: setCurrentQuestion,
  };
};
