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
  
  // Storage key management
  getStorageKey: () => string;
  clearOldSessions: (currentToken: string) => void;
}

// Helper to ensure answers is always a Map
const ensureMap = (value: unknown): Map<string, number> => {
  if (value instanceof Map) return value;
  if (Array.isArray(value)) {
    // Check if it's an array of entries [[key, value], ...]
    return new Map(value as [string, number][]);
  }
  if (value && typeof value === "object") {
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

// Base storage key - will be combined with session token
const BASE_STORAGE_KEY = "exam-session";

// Get session-specific storage key
const getStorageKeyForSession = (sessionToken: string | null): string => {
  if (!sessionToken) return `${BASE_STORAGE_KEY}-temp`;
  // Use a hash of the session token to keep key length reasonable
  return `${BASE_STORAGE_KEY}-${sessionToken}`;
};

// Clear old session storage entries (keeps only current session)
const clearOldSessionStorage = (currentToken: string | null) => {
  if (typeof window === "undefined") return;
  
  const currentKey = getStorageKeyForSession(currentToken);
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(BASE_STORAGE_KEY) && key !== currentKey) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    try {
      sessionStorage.removeItem(key);
      console.log(`[ExamStore] Cleaned up old session: ${key}`);
    } catch (e) {
      console.error(`[ExamStore] Failed to remove old session ${key}:`, e);
    }
  });
};

// Type for persisted state (only data, no actions)
type PersistedExamState = Pick<
  ExamState,
  '_hasHydrated' | 'currentQuestion' | 'answers' | 'markedQuestions' | 'timeLeft' |
  'isExamSubmitted' | 'examMetadata' | 'questions' | 'sessionToken'
>;

const useExamStoreBase = create<ExamState>()(
  devtools(
    (set, get) => ({
      // Initial State (before hydration)
      _hasHydrated: false,
      currentQuestion: 1,
      answers: new Map(),
      markedQuestions: new Set(),
      timeLeft: 0,
      isExamSubmitted: false,
      examMetadata: null,
      questions: [],
      sessionToken: null,

      // Actions
      setSessionToken: (token) => {
        const oldToken = get().sessionToken;
        
        // If token is changing, clear old session data
        if (oldToken && oldToken !== token) {
          console.log(`[ExamStore] Session token changed from ${oldToken?.slice(0, 8)}... to ${token.slice(0, 8)}...`);
          clearOldSessionStorage(token);
        }
        
        set({ sessionToken: token });
      },

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

      loadExam: (metadata, questions, savedAnswers?, timeRemaining?, resumeState?) => {
        // Validate question count matches metadata
        if (metadata.totalQuestions !== questions.length) {
          console.warn(
            `[ExamStore] Question count mismatch: metadata says ${metadata.totalQuestions}, but loaded ${questions.length} questions`
          );
        }
        
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
          sessionToken: metadata.examSessionId,
        });
        
        // Clear any old sessions when loading a new exam
        clearOldSessionStorage(metadata.examSessionId);
      },

      submitExam: () => set({ isExamSubmitted: true }),

      resetExam: () => {
        const token = get().sessionToken;
        
        // Clear session storage for current session
        if (token) {
          const storageKey = getStorageKeyForSession(token);
          sessionStorage.removeItem(storageKey);
          console.log(`[ExamStore] Cleared session storage for ${storageKey}`);
        }
        
        // Clear all exam-related storage
        clearOldSessionStorage(null);
        
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

      // Utility to get current storage key
      getStorageKey: () => {
        return getStorageKeyForSession(get().sessionToken);
      },

      // Clear old sessions utility
      clearOldSessions: (currentToken) => {
        clearOldSessionStorage(currentToken);
      },
    }),
    { name: "ExamStore" }
  )
);

// Wrap with persist middleware separately to handle dynamic storage key
const useExamStorePersisted = create<ExamState>()(
  devtools(
    persist(
      (set, get) => ({
        ...useExamStoreBase.getState(),
        
        // Override loadExam to set session token before loading
        loadExam: (metadata, questions, savedAnswers?, timeRemaining?, resumeState?) => {
          // First set the session token so persist uses the right key
          set({ sessionToken: metadata.examSessionId });
          
          // Then call the actual load logic
          useExamStoreBase.getState().loadExam(
            metadata,
            questions,
            savedAnswers,
            timeRemaining,
            resumeState
          );
        },
      }),
      {
        name: BASE_STORAGE_KEY, // Base name - actual key is determined by getStorageKey
        storage: {
          getItem: (name) => {
            // Get the current session token from state
            const state = useExamStoreBase.getState();
            const storageKey = getStorageKeyForSession(state.sessionToken);
            
            const str = sessionStorage.getItem(storageKey);
            if (!str) return null;
            try {
              return JSON.parse(str);
            } catch {
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              // Get the current session token from the value being stored
              const state = value.state as ExamState;
              const storageKey = getStorageKeyForSession(state.sessionToken);
              
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

              sessionStorage.setItem(storageKey, JSON.stringify({
                state: serializedState,
                version: value.version
              }));
              
              if (import.meta.env.DEV) {
                console.log(`[ExamStore] Persisted to ${storageKey}`);
              }
            } catch (e) {
              console.error("[ExamStore] Failed to store exam state:", e);
            }
          },
          removeItem: (name) => {
            const state = useExamStoreBase.getState();
            const storageKey = getStorageKeyForSession(state.sessionToken);
            sessionStorage.removeItem(storageKey);
          },
        },
        // Rehydrate: convert arrays back to Map/Set after loading from storage
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert arrays back to Map/Set
            state.answers = ensureMap(state.answers);
            state.markedQuestions = ensureSet(state.markedQuestions);
            state._hasHydrated = true;

            // Validate loaded session matches the URL token if available
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get("session");
            
            if (urlToken && state.sessionToken && urlToken !== state.sessionToken) {
              console.warn(
                `[ExamStore] URL token (${urlToken.slice(0, 8)}...) doesn't match stored session (${state.sessionToken.slice(0, 8)}...). This session will be cleared.`
              );
              // Don't use this persisted state - it belongs to a different exam
              state.questions = [];
              state.examMetadata = null;
            }

            if (import.meta.env.DEV) {
              console.log(`[ExamStore] Rehydrated with ${state.questions.length} questions`);
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
export const useExamStore = createSelectors(useExamStorePersisted);
