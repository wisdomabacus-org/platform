// services/mock-tests.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { MockTest } from "@/types/mock-test";

export const mockTestsService = {
  /**
   * Get all available mock tests
   * GET /mock-tests
   * Returns grade-filtered tests for authenticated users, all published for anonymous
   */
  getAll: async (): Promise<MockTest[]> => {
    const response = await apiClient.get("/mock-tests") as ApiResponse<MockTest[]>;
    return response.data || [];
  },

  /**
   * Get single mock test details
   * GET /mock-tests/:id
   */
  getById: async (id: string): Promise<MockTest> => {
    const response = await apiClient.get(`/mock-tests/${id}`) as ApiResponse<MockTest>;
    return response.data!;
  },
};
