// src/features/exam/store/examStore.ts
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
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

// Custom storage handlers for Map and Set serialization
const customStorage = {
  getItem: (name: string) => {
    const str = sessionStorage.getItem(name);
    if (!str) return null;

    try {
      const parsed = JSON.parse(str);
      // Rehydrate state
      if (parsed.state) {
        // Convert answers array back to Map
        if (parsed.state.answers && Array.isArray(parsed.state.answers)) {
          parsed.state.answers = new Map(parsed.state.answers);
        }
        // Convert markedQuestions array back to Set
        if (parsed.state.markedQuestions && Array.isArray(parsed.state.markedQuestions)) {
          parsed.state.markedQuestions = new Set(parsed.state.markedQuestions);
        }
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse exam store:", e);
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    try {
      // Cast to object with state property
      const valueObj = value as { state: Record<string, unknown>; version?: number };
      const state = valueObj.state;

      // Serialize with Map/Set converted to arrays
      const serializedState: Record<string, unknown> = {
        ...state,
        // Convert Map to array for JSON serialization
        answers: state.answers instanceof Map
          ? Array.from((state.answers as Map<string, number>).entries())
          : state.answers,
        // Convert Set to array for JSON serialization
        markedQuestions: state.markedQuestions instanceof Set
          ? Array.from(state.markedQuestions as Set<string>)
          : state.markedQuestions,
      };

      const serialized = {
        state: serializedState,
        version: valueObj.version,
      };

      sessionStorage.setItem(name, JSON.stringify(serialized));
    } catch (e) {
      console.error("Failed to store exam store:", e);
    }
  },
  removeItem: (name: string) => sessionStorage.removeItem(name),
};

const useExamStoreBase = create<ExamState>()(
  devtools(
    persist(
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

        resetExam: () => {
          // Clear session storage on reset
          sessionStorage.removeItem("exam-session-storage");
          set({
            currentQuestion: 1,
            answers: new Map(),
            markedQuestions: new Set(),
            timeLeft: 0,
            isExamSubmitted: false,
            examMetadata: null,
            questions: [],
            sessionToken: null,
          });
        },
      }),
      {
        name: "exam-session-storage",
        storage: createJSONStorage(() => customStorage),
        // Only persist these fields (not functions)
        partialize: (state) => ({
          currentQuestion: state.currentQuestion,
          answers: state.answers,
          markedQuestions: state.markedQuestions,
          timeLeft: state.timeLeft,
          isExamSubmitted: state.isExamSubmitted,
          examMetadata: state.examMetadata,
          questions: state.questions,
          sessionToken: state.sessionToken,
        }),
      }
    ),
    { name: "ExamStore" }
  )
);

// Create selectors
export const useExamStore = createSelectors(useExamStoreBase);
