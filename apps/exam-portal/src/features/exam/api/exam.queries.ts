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
  HeartbeatResponse,
  SubmitExamResponse,
} from "@/types/exam.types";

// Centralized query keys - now session-aware
export const examQueryKeys = {
  root: ["exam"] as const,
  session: (sessionToken?: string) => 
    sessionToken 
      ? (["exam", "session", sessionToken] as const)
      : (["exam", "session"] as const),
  heartbeat: (sessionToken?: string) => 
    sessionToken 
      ? (["exam", "heartbeat", sessionToken] as const)
      : (["exam", "heartbeat"] as const),
};

// Get current session token from store (for use in components)
const getSessionToken = () => {
  // This will be called within components where the store is available
  // We import dynamically to avoid circular dependencies
  const { useExamStore } = require("@/features/exam/store/examStore");
  return useExamStore.getState().sessionToken;
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

/**
 * Heartbeat query to keep `timeRemaining` and status in sync.
 * Caller can control `refetchInterval` (e.g. 10–15s) via options.
 * 
 * Uses session-specific query key to prevent cache sharing
 */
export const useHeartbeatQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiResponse<HeartbeatResponse>,
      Error,
      ApiResponse<HeartbeatResponse>,
      ReturnType<typeof examQueryKeys.heartbeat>
    >,
    "queryKey" | "queryFn"
  > & { sessionToken?: string }
) => {
  const sessionToken = options?.sessionToken;
  
  return useQuery({
    queryKey: examQueryKeys.heartbeat(sessionToken),
    queryFn: examApi.getHeartbeat,
    enabled: false, // Caller must enable explicitly
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examApi.submitAnswer,
    onSuccess: (_, variables) => {
      // Optional: keep heartbeat data fresh
      const sessionToken = getSessionToken();
      queryClient.invalidateQueries({ 
        queryKey: examQueryKeys.heartbeat(sessionToken || undefined) 
      });
    },
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
      // After submit, exam session is done → clear cached session/heartbeat.
      // We need to clear ALL session keys since we don't know the token anymore
      queryClient.removeQueries({ queryKey: ["exam", "session"] });
      queryClient.removeQueries({ queryKey: ["exam", "heartbeat"] });
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
      queryClient.removeQueries({ queryKey: ["exam", "heartbeat"] });
    },
    clearSessionCache: (sessionToken?: string) => {
      queryClient.removeQueries({ 
        queryKey: examQueryKeys.session(sessionToken) 
      });
    },
  };
};
