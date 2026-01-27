
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { referralsService } from '../api/referrals.service';
import { QUERY_KEYS } from '@/config/constants';
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
            toast.success('Referrer created (Mock)');
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
    });
}
