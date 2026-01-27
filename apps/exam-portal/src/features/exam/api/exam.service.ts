// src/features/exam/api/exam.service.ts
import { supabase } from "@/lib/supabase";
import {
  mapInitExamResponse,
  type DbInitExamResponse,
  mapSubmitAnswerResponse,
  type DbSubmitAnswerResponse,
  mapHeartbeatResponse,
  type DbHeartbeatResponse,
  mapSubmitExamResponse,
  type DbSubmitExamResponse
} from "@/lib/mappers";
import { useExamStore } from "@/features/exam/store/examStore";
import type { ApiResponse } from "@/types/api.types";
import type {
  InitializeExamResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  HeartbeatResponse,
  SubmitExamResponse,
} from "@/types/exam.types";

/**
 * Helper to get the current session token from store
 */
const getSessionToken = () => {
  const token = useExamStore.getState().sessionToken;
  if (!token) {
    throw new Error("No active exam session token");
  }
  return token;
};

export const examApi = {
  /**
   * GET /exam/session/init
   * Call 'exam-init' Edge Function
   */
  initializeSession: async (): Promise<ApiResponse<InitializeExamResponse>> => {
    const token = getSessionToken();

    const { data, error } = await supabase.functions.invoke('exam-init', {
      body: { session_token: token }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Failed to initialize session");

    // Map the response
    const mappedData = mapInitExamResponse(data.data as DbInitExamResponse);

    return {
      success: true,
      data: mappedData,
      message: "Session initialized"
    };
  },

  /**
   * POST /exam/session/answer
   * Call 'exam-answer' Edge Function
   */
  submitAnswer: async (
    payload: SubmitAnswerPayload
  ): Promise<ApiResponse<SubmitAnswerResponse>> => {
    const token = getSessionToken();

    const { data, error } = await supabase.functions.invoke('exam-answer', {
      body: {
        session_token: token,
        question_id: payload.questionId,
        selected_option_index: payload.selectedOptionIndex
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Failed to submit answer");

    const mappedData = mapSubmitAnswerResponse(data.data as DbSubmitAnswerResponse);

    return {
      success: true,
      data: {
        success: true,
        ...mappedData
      },
      message: "Answer saved"
    };
  },

  /**
   * GET /exam/session/heartbeat
   * Call 'exam-heartbeat' Edge Function
   */
  getHeartbeat: async (): Promise<ApiResponse<HeartbeatResponse>> => {
    const token = getSessionToken();

    const { data, error } = await supabase.functions.invoke('exam-heartbeat', {
      body: { session_token: token }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Heartbeat failed");

    // Map response
    const mappedData = mapHeartbeatResponse(data.data as DbHeartbeatResponse);

    return {
      success: true,
      data: mappedData,
      message: "Heartbeat OK"
    };
  },

  /**
   * POST /exam/session/submit
   * Call 'exam-submit' Edge Function
   */
  submitExam: async (): Promise<ApiResponse<SubmitExamResponse>> => {
    const token = getSessionToken();

    const { data, error } = await supabase.functions.invoke('exam-submit', {
      body: { session_token: token }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || "Failed to submit exam");

    const mappedData = mapSubmitExamResponse(data.data as DbSubmitExamResponse);

    return {
      success: true,
      data: {
        success: true,
        ...mappedData,
        message: "Exam submitted successfully"
      },
      message: "Exam submitted"
    };
  },
};
