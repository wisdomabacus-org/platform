// src/features/exam/api/exam.service.ts
import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.types";
import type {
  InitializeExamResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  HeartbeatResponse,
  SubmitExamResponse,
} from "@/types/exam.types";

export const examApi = {
  /**
   * GET /exam/session/init
   * Uses cookies (user session + exam session) set by /exam/start on main site.
   * Returns ApiResponse<InitializeExamResponse> - caller can access .data, .message, .success
   */
  initializeSession: async (): Promise<ApiResponse<InitializeExamResponse>> => {
    return apiClient.get("/exam/session/init") as Promise<
      ApiResponse<InitializeExamResponse>
    >;
  },

  /**
   * POST /exam/session/answer
   * Save single answer in Redis-backed exam session.
   */
  submitAnswer: async (
    payload: SubmitAnswerPayload
  ): Promise<ApiResponse<SubmitAnswerResponse>> => {
    return apiClient.post("/exam/session/answer", payload) as Promise<
      ApiResponse<SubmitAnswerResponse>
    >;
  },

  /**
   * GET /exam/session/heartbeat
   * Get remaining time + answered count + status, used for resync & auto-submit.
   */
  getHeartbeat: async (): Promise<ApiResponse<HeartbeatResponse>> => {
    return apiClient.get("/exam/session/heartbeat") as Promise<
      ApiResponse<HeartbeatResponse>
    >;
  },

  /**
   * POST /exam/session/submit
   * Final exam submission → returns submissionId + optional redirectUrl.
   */
  submitExam: async (): Promise<ApiResponse<SubmitExamResponse>> => {
    return apiClient.post("/exam/session/submit") as Promise<
      ApiResponse<SubmitExamResponse>
    >;
  },
};
