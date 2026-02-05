// src/features/exam/store/examStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createSelectors } from "@/lib/createSelectors";
import type { Question, ExamMetadata } from "@/types/exam.types";

interface ResumeState {
  lastQuestionIndex?: number;
  markedQuestions?: string[];
}

interface ExamState {
  // Hydration flag
  _hasHydrated: boolean;

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
  setTimeLeft: (time: number) => void;
  loadExam: (
    metadata: ExamMetadata,
    questions: Question[],
    savedAnswers?: Record<string, number>,
    timeRemaining?: number,
    resumeState?: ResumeState
  ) => void;
  submitExam: () => void;
  resetExam: () => void;
}

// Helper to ensure answers is always a Map
const ensureMap = (value: unknown): Map<string, number> => {
  if (value instanceof Map) return value;
  if (Array.isArray(value)) {
    // Check if it's an array of entries [[key, value], ...]
    return new Map(value as [string, number][]);
  }
  if (value && typeof value === 'object') {
    return new Map(Object.entries(value as Record<string, number>));
  }
  return new Map();
};

// Helper to ensure markedQuestions is always a Set
const ensureSet = (value: unknown): Set<string> => {
  if (value instanceof Set) return value;
  if (Array.isArray(value)) return new Set(value as string[]);
  return new Set();
};

// Type for persisted state (only data, no actions)
type PersistedExamState = Pick<
  ExamState,
  '_hasHydrated' | 'currentQuestion' | 'answers' | 'markedQuestions' | 'timeLeft' |
  'isExamSubmitted' | 'examMetadata' | 'questions' | 'sessionToken'
>;

const STORAGE_KEY = "exam-session-storage";

const useExamStoreBase = create<ExamState>()(
  devtools(
    persist(
      (set, get) => ({
        // Hydration flag - starts false, set to true after rehydration
        _hasHydrated: false,

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
            const currentAnswers = ensureMap(state.answers);
            const newAnswers = new Map(currentAnswers);
            newAnswers.set(questionId, answerIndex);
            return { answers: newAnswers };
          }),

        toggleMarkForReview: (questionId) =>
          set((state) => {
            const currentMarked = ensureSet(state.markedQuestions);
            const newMarked = new Set(currentMarked);
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

        setTimeLeft: (time) => set({ timeLeft: time }),

        loadExam: (metadata, questions, savedAnswers?, timeRemaining?, resumeState?) =>
          set({
            examMetadata: metadata,
            questions,
            // Use time remaining if provided (for resume), otherwise calculate from duration
            timeLeft: timeRemaining ?? metadata.durationMinutes * 60,
            // Restore last question position if resuming
            currentQuestion: resumeState?.lastQuestionIndex ?? 1,
            // Restore saved answers if provided
            answers: savedAnswers ? new Map(Object.entries(savedAnswers)) : new Map(),
            // Restore marked questions if resuming
            markedQuestions: resumeState?.markedQuestions
              ? new Set(resumeState.markedQuestions)
              : new Set(),
            isExamSubmitted: false,
          }),

        submitExam: () => set({ isExamSubmitted: true }),

        resetExam: () => {
          // Clear session storage on reset
          sessionStorage.removeItem(STORAGE_KEY);
          set({
            _hasHydrated: true, // Keep hydrated after reset
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
        name: STORAGE_KEY,
        storage: {
          getItem: (name) => {
            const str = sessionStorage.getItem(name);
            if (!str) return null;
            try {
              return JSON.parse(str);
            } catch {
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              // Access state safely
              const state = value.state as ExamState;

              // Serialize Map and Set to arrays
              const serializedState = {
                currentQuestion: state.currentQuestion,
                answers: state.answers instanceof Map
                  ? Array.from(state.answers.entries())
                  : [],
                markedQuestions: state.markedQuestions instanceof Set
                  ? Array.from(state.markedQuestions)
                  : [],
                timeLeft: state.timeLeft,
                isExamSubmitted: state.isExamSubmitted,
                examMetadata: state.examMetadata,
                questions: state.questions,
                sessionToken: state.sessionToken,
              };

              sessionStorage.setItem(name, JSON.stringify({
                state: serializedState,
                version: value.version
              }));
            } catch (e) {
              console.error("Failed to store exam state:", e);
            }
          },
          removeItem: (name) => sessionStorage.removeItem(name),
        },
        // Rehydrate: convert arrays back to Map/Set after loading from storage
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert arrays back to Map/Set
            state.answers = ensureMap(state.answers);
            state.markedQuestions = ensureSet(state.markedQuestions);
            state._hasHydrated = true;

            // Dev diagnostics for serialization issues
            if (import.meta.env.DEV) {
              if (!(state.answers instanceof Map)) {
                console.error('[ExamStore] answers is not a Map after hydration!', state.answers);
              }
              if (!(state.markedQuestions instanceof Set)) {
                console.error('[ExamStore] markedQuestions is not a Set after hydration!', state.markedQuestions);
              }
            }
          } else {
            // No persisted state - still mark as hydrated
            useExamStoreBase.setState({ _hasHydrated: true });
          }
        },
        // Only persist these fields (not functions, not _hasHydrated)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partialize: (state) => ({
          currentQuestion: state.currentQuestion,
          answers: state.answers,
          markedQuestions: state.markedQuestions,
          timeLeft: state.timeLeft,
          isExamSubmitted: state.isExamSubmitted,
          examMetadata: state.examMetadata,
          questions: state.questions,
          sessionToken: state.sessionToken,
        }) as any,
      }
    ),
    { name: "ExamStore" }
  )
);

// Create selectors
export const useExamStore = createSelectors(useExamStoreBase);
