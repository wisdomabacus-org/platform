// services/requests.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { DemoRequest, ContactRequest, RequestResponse } from "@/types/request";

export const requestsService = {
    /**
     * Submit Demo Request
     * POST /requests/demo
     */
    submitDemoRequest: async (payload: DemoRequest): Promise<RequestResponse> => {
        const response = await apiClient.post("/requests/demo", payload) as ApiResponse<RequestResponse>;
        return response.data!;
    },

    /**
     * Submit Contact Request
     * POST /requests/contact
     */
    submitContactRequest: async (payload: ContactRequest): Promise<RequestResponse> => {
        const response = await apiClient.post("/requests/contact", payload) as ApiResponse<RequestResponse>;
        return response.data!;
    },
};
