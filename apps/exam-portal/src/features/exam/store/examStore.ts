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
  sessionToken: string | null;

  // Actions
  setSessionToken: (token: string) => void;
  setCurrentQuestion: (questionNumber: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: string, answerIndex: number) => void;
  toggleMarkForReview: (questionId: string) => void;
  decrementTime: () => void;
  loadExam: (metadata: ExamMetadata, questions: Question[], savedAnswers?: Record<string, number>, timeRemaining?: number) => void;
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
      sessionToken: null,

      // Actions
      setSessionToken: (token) => set({ sessionToken: token }),
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

      loadExam: (metadata, questions, savedAnswers?, timeRemaining?) =>
        set({
          examMetadata: metadata,
          questions,
          // Use time remaining if provided (for resume), otherwise calculate from duration
          timeLeft: timeRemaining ?? metadata.durationMinutes * 60,
          currentQuestion: 1,
          // Restore saved answers if provided
          answers: savedAnswers ? new Map(Object.entries(savedAnswers)) : new Map(),
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
          sessionToken: null,
        }),
    }),
    { name: "ExamStore" }
  )
);

// Create selectors
export const useExamStore = createSelectors(useExamStoreBase);
