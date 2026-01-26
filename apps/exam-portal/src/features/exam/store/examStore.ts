// src/features/exam/store/examStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createSelectors } from "@/lib/createSelectors";
import type { Question, ExamMetadata } from "@/types/exam.types";

interface ExamState {
  // State
  currentQuestion: number; // 1-based index for UI
  answers: Map<string, number>; // questionId (string) → selectedOptionIndex
  markedQuestions: Set<string>; // questionId (string)
  timeLeft: number;
  isExamSubmitted: boolean;
  examMetadata: ExamMetadata | null;
  questions: Question[];

  // Actions
  setCurrentQuestion: (questionNumber: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: string, answerIndex: number) => void;
  toggleMarkForReview: (questionId: string) => void;
  decrementTime: () => void;
  loadExam: (metadata: ExamMetadata, questions: Question[]) => void;
  submitExam: () => void;
  resetExam: () => void;
}

const useExamStoreBase = create<ExamState>()(
  devtools(
    (set, get) => ({
      // Initial State
      currentQuestion: 1,
      answers: new Map(),
      markedQuestions: new Set(),
      timeLeft: 0,
      isExamSubmitted: false,
      examMetadata: null,
      questions: [],

      // Actions
      setCurrentQuestion: (questionNumber) =>
        set({ currentQuestion: questionNumber }),

      goToNextQuestion: () => {
        const { currentQuestion, questions } = get();
        if (currentQuestion < questions.length) {
          set({ currentQuestion: currentQuestion + 1 });
        }
      },

      goToPreviousQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion > 1) {
          set({ currentQuestion: currentQuestion - 1 });
        }
      },

      setAnswer: (questionId, answerIndex) =>
        set((state) => {
          const newAnswers = new Map(state.answers);
          newAnswers.set(questionId, answerIndex);
          return { answers: newAnswers };
        }),

      toggleMarkForReview: (questionId) =>
        set((state) => {
          const newMarked = new Set(state.markedQuestions);
          if (newMarked.has(questionId)) {
            newMarked.delete(questionId);
          } else {
            newMarked.add(questionId);
          }
          return { markedQuestions: newMarked };
        }),

      decrementTime: () =>
        set((state) => ({
          timeLeft: Math.max(0, state.timeLeft - 1),
        })),

      loadExam: (metadata, questions) =>
        set({
          examMetadata: metadata,
          questions,
          timeLeft: metadata.durationMinutes * 60, // Convert to seconds
          currentQuestion: 1,
          answers: new Map(),
          markedQuestions: new Set(),
          isExamSubmitted: false,
        }),

      submitExam: () => set({ isExamSubmitted: true }),

      resetExam: () =>
        set({
          currentQuestion: 1,
          answers: new Map(),
          markedQuestions: new Set(),
          timeLeft: 0,
          isExamSubmitted: false,
          examMetadata: null,
          questions: [],
        }),
    }),
    { name: "ExamStore" }
  )
);

// Create selectors
export const useExamStore = createSelectors(useExamStoreBase);
