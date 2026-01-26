// services/enrollments.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type {
  Enrollment,
  CreateEnrollmentResponse,
  EnrollmentStatus
} from "@/types/enrollment";

export const enrollmentsService = {

  /**
   * Check if user is enrolled in a specific competition
   * GET /enrollments/status/:competitionId
   */
  checkStatus: async (competitionId: string): Promise<EnrollmentStatus> => {
    const response = await apiClient.get(
      `/enrollments/status/${competitionId}`
    ) as ApiResponse<EnrollmentStatus>;
    return response.data!;
  },

  /**
   * Initiate enrollment (Create Payment & Order)
   * POST /enrollments/competition/:id
   */
  createEnrollment: async (competitionId: string): Promise<CreateEnrollmentResponse> => {
    const response = await apiClient.post(
      `/enrollments/competition/${competitionId}`
    ) as ApiResponse<CreateEnrollmentResponse>;
    return response.data!;
  },

  /**
   * Get all my enrollments
   * GET /enrollments/my-enrollments
   */
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get("/enrollments/my-enrollments") as ApiResponse<Enrollment[]>;
    return response.data || [];
  }
};
