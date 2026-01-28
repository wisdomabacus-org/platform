
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { referralsService } from '../api/referrals.service';
import { toast } from 'sonner';

const QUERY_KEY = ['referrers'];

export function useReferrers() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: referralsService.getAll,
    });
}

export function useCreateReferrer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: referralsService.create,
        onSuccess: () => {
            toast.success('Referrer created successfully');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            toast.error(`Failed to create referrer: ${error.message}`);
        }
    });
}

export function useUpdateReferrer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: referralsService.update,
        onSuccess: () => {
            toast.success('Referrer updated successfully');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            toast.error(`Failed to update referrer: ${error.message}`);
        }
    });
}

export function useDeleteReferrer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: referralsService.delete,
        onSuccess: () => {
            toast.success('Referrer deleted successfully');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            toast.error(`Failed to delete referrer: ${error.message}`);
        }
    });
}
