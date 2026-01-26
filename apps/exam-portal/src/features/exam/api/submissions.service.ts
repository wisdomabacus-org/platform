// src/features/exam/api/submissions.service.ts
import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.types";

export interface SubmissionResult {
  id: string;
  userId: string;
  examType: "competition" | "mock-test";
  examId: string;
  examTitle: string;
  status: "in-progress" | "completed" | "abandoned";
  score: number;
  totalMarks: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  percentage: number;
  rank?: number;
  submittedAt: string;
  createdAt: string;
}

export const submissionsApi = {
  /**
   * GET /submissions/:id
   * Fetch submission result by ID
   */
  getSubmissionById: (
    submissionId: string
  ): Promise<ApiResponse<SubmissionResult>> => {
    return apiClient.get(`/submissions/${submissionId}`) as Promise<
      ApiResponse<SubmissionResult>
    >;
  },
};
