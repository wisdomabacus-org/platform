// src/features/exam/api/submissions.service.ts
import { supabase } from "@/lib/supabase";
import { mapSubmissionResult, type DbSubmissionHistoryRow } from "@/lib/mappers";
import type { ApiResponse } from "@/types/api.types";
import type { SubmissionResult } from "@/types/exam.types";

export const submissionsApi = {
  /**
   * GET /submissions/:id
   * Fetch submission result by ID from user_submission_history view
   */
  getSubmissionById: async (
    submissionId: string
  ): Promise<ApiResponse<SubmissionResult>> => {

    const { data, error } = await supabase
      .from('user_submission_history')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    if (error) {
      // Handle Supabase error
      console.error("Error fetching submission:", error);
      throw new Error(error.message || "Failed to fetch submission");
    }

    if (!data) {
      throw new Error("Submission not found");
    }

    const result = mapSubmissionResult(data as DbSubmissionHistoryRow);

    return {
      success: true,
      data: result,
      message: "Submission loaded"
    };
  },
};
