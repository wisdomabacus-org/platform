// src/features/exam/api/exam.queries.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { examApi } from "./exam.service";
import type { ApiResponse } from "@/types/api.types";
import type {
  InitializeExamResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  SubmitExamResponse,
} from "@/types/exam.types";

// Centralized query keys - session-aware
export const examQueryKeys = {
  root: ["exam"] as const,
  session: (sessionToken?: string) =>
    sessionToken
      ? (["exam", "session", sessionToken] as const)
      : (["exam", "session"] as const),
};

// --- Queries ---

/**
 * Fetch exam session + questions once when portal initializes.
 * Returns ApiResponse<InitializeExamResponse> - access .data for the payload
 *
 * Uses session-specific query key to prevent cache sharing between different exams
 */
export const useInitializeExamQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiResponse<InitializeExamResponse>,
      Error,
      ApiResponse<InitializeExamResponse>,
      ReturnType<typeof examQueryKeys.session>
    >,
    "queryKey" | "queryFn"
  > & { sessionToken?: string }
) => {
  // Use provided token or let the query function handle it
  const sessionToken = options?.sessionToken;

  return useQuery({
    queryKey: examQueryKeys.session(sessionToken),
    queryFn: examApi.initializeSession,
    retry: 1,
    // Disable caching between sessions - always fetch fresh data
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
};

// --- Mutations ---

/**
 * Save a single answer.
 * UI will stay optimistic via Zustand; this mutation is for durability.
 */
export const useSubmitAnswerMutation = (
  options?: UseMutationOptions<
    ApiResponse<SubmitAnswerResponse>,
    Error,
    SubmitAnswerPayload
  >
) => {
  return useMutation({
    mutationFn: examApi.submitAnswer,
    ...options,
  });
};

/**
 * Final exam submission.
 * Used from useExamSubmit / SubmitDialog.
 * Clears all exam-related cache on success.
 */
export const useSubmitExamMutation = (
  options?: UseMutationOptions<ApiResponse<SubmitExamResponse>, Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examApi.submitExam,
    onSuccess: () => {
      // After submit, exam session is done → clear cached session data.
      queryClient.removeQueries({ queryKey: ["exam", "session"] });
    },
    ...options,
  });
};

/**
 * Utility hook to clear all exam-related cache
 * Useful when starting a new exam or handling errors
 */
export const useClearExamCache = () => {
  const queryClient = useQueryClient();

  return {
    clearAllExamCache: () => {
      queryClient.removeQueries({ queryKey: ["exam", "session"] });
    },
    clearSessionCache: (sessionToken?: string) => {
      queryClient.removeQueries({
        queryKey: examQueryKeys.session(sessionToken),
      });
    },
  };
};
