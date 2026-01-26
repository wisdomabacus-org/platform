// hooks/use-requests.ts
import { useMutation } from "@tanstack/react-query";
import { requestsService } from "@/services/requests.service";
import { toast } from "sonner";

export function useDemoRequest() {
    return useMutation({
        mutationFn: requestsService.submitDemoRequest,
        onSuccess: (data) => {
            toast.success(data.message || "Demo request submitted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit demo request. Please try again.");
        },
    });
}

export function useContactRequest() {
    return useMutation({
        mutationFn: requestsService.submitContactRequest,
        onSuccess: (data) => {
            toast.success(data.message || "Your message has been sent successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to send message. Please try again.");
        },
    });
}
