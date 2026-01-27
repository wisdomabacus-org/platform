
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsService } from '../api/requests.service';
import { RequestFilters } from '../types/requests.types';
import { toast } from 'sonner';

const QUERY_KEY = ['requests'];

export function useRequests(filters?: RequestFilters) {
    return useQuery({
        queryKey: [...QUERY_KEY, filters],
        queryFn: () => requestsService.getAll(filters),
    });
}

export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, type, status, response }: { id: string, type: 'contact' | 'demo', status: string, response?: string }) =>
            requestsService.updateStatus(id, type, status, response),
        onSuccess: () => {
            toast.success('Request updated');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (err) => {
            toast.error('Failed to update request');
            console.error(err);
        }
    });
}
