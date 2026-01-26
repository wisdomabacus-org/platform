import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type {
  Competition,
  CompetitionResults,
  EnrollmentStatus,
  CompetitionListQuery
} from "@/types/competition";

export const competitionsService = {
  // ==========================================
  // Public Endpoints
  // ==========================================

  /**
   * Get featured competition
   * GET /competitions/featured
   */
  getFeatured: async (): Promise<Competition | null> => {
    try {
      const response = await apiClient.get("/competitions/featured") as ApiResponse<Competition>;
      return response.data || null;
    } catch (error) {
      console.warn("No featured competition found or error fetching:", error);
      return null;
    }
  },

  /**
   * Get all public competitions with filters
   * GET /competitions/public
   */
  getAllPublic: async (
    filters: Partial<CompetitionListQuery> = {}
  ): Promise<Competition[]> => {
    const response = await apiClient.get("/competitions/public", {
      params: filters,
    }) as ApiResponse<Competition[]>;
    return response.data || [];
  },

  /**
   * Get single competition details (public)
   * GET /competitions/:id
   */
  getById: async (id: string): Promise<Competition> => {
    const response = await apiClient.get(`/competitions/${id}`) as ApiResponse<Competition>;
    return response.data!;
  },

  /**
   * Get competition results (public)
   * GET /competitions/:id/results
   */
  getResults: async (competitionId: string): Promise<CompetitionResults> => {
    const response = await apiClient.get(
      `/competitions/${competitionId}/results`
    ) as ApiResponse<CompetitionResults>;
    return response.data!;
  },

  // ==========================================
  // Authenticated Endpoints
  // ==========================================

  /**
   * Get competitions for logged-in user (based on their grade/profile)
   * GET /competitions
   * Requires: User authentication
   */
  getMyCompetitions: async (params?: { page?: number; limit?: number }): Promise<Competition[]> => {
    const response = await apiClient.get("/competitions", {
      params
    }) as ApiResponse<Competition[]>;
    return response.data || [];
  },

  /**
   * Check enrollment status for a competition
   * GET /enrollments/check/:competitionId
   */
  checkEnrollment: async (competitionId: string): Promise<EnrollmentStatus> => {
    try {
      const response = await apiClient.get(
        `/enrollments/check/${competitionId}`
      ) as ApiResponse<EnrollmentStatus>;
      return response.data!;
    } catch (error) {
      // If 404 or 401, assume not enrolled or handle accordingly
      return { isEnrolled: false };
    }
  },
};
