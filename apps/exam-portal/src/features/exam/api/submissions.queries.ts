// src/features/exam/api/submissions.queries.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { submissionsApi } from "./submissions.service";
import type { SubmissionResult } from "@/types/exam.types";
import type { ApiResponse } from "@/types/api.types";

export const submissionsQueryKeys = {
  root: ["submissions"] as const,
  detail: (id: string) => ["submissions", id] as const,
};

/**
 * Fetch submission result by ID
 */
export const useSubmissionQuery = (
  submissionId: string | null,
  options?: Omit<
    UseQueryOptions<
      ApiResponse<SubmissionResult>,
      Error,
      ApiResponse<SubmissionResult>,
      readonly ["submissions", string]
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: submissionsQueryKeys.detail(submissionId || ""),
    queryFn: () => submissionsApi.getSubmissionById(submissionId!),
    enabled: !!submissionId, // Only run if submissionId exists
    ...options,
  });
};
