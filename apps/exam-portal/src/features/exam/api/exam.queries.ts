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

// Centralized query keys
export const examQueryKeys = {
  root: ["exam"] as const,
  session: ["exam", "session"] as const,
  heartbeat: ["exam", "heartbeat"] as const,
};

// --- Queries ---

/**
 * Fetch exam session + questions once when portal initializes.
 * Returns ApiResponse<InitializeExamResponse> - access .data for the payload
 */
export const useInitializeExamQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiResponse<InitializeExamResponse>,
      Error,
      ApiResponse<InitializeExamResponse>,
      readonly ["exam", "session"]
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: examQueryKeys.session,
    queryFn: examApi.initializeSession,
    retry: 1,
    ...options,
  });
};

/**
 * Heartbeat query to keep `timeRemaining` and status in sync.
 * Caller can control `refetchInterval` (e.g. 10–15s) via options.
 */
export const useHeartbeatQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiResponse<HeartbeatResponse>,
      Error,
      ApiResponse<HeartbeatResponse>,
      readonly ["exam", "heartbeat"]
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: examQueryKeys.heartbeat,
    queryFn: examApi.getHeartbeat,
    enabled: false, // Caller must enable explicitly
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
    onSuccess: () => {
      // Optional: keep heartbeat data fresh
      queryClient.invalidateQueries({ queryKey: examQueryKeys.heartbeat });
    },
    ...options,
  });
};

/**
 * Final exam submission.
 * Used from useExamSubmit / SubmitDialog.
 */
export const useSubmitExamMutation = (
  options?: UseMutationOptions<ApiResponse<SubmitExamResponse>, Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examApi.submitExam,
    onSuccess: () => {
      // After submit, exam session is done → clear cached session/heartbeat.
      queryClient.removeQueries({ queryKey: examQueryKeys.session });
      queryClient.removeQueries({ queryKey: examQueryKeys.heartbeat });
    },
    ...options,
  });
};
