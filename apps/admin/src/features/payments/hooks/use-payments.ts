
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../api/payments.service';
import { PaymentFilters } from '../types/payment.types';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from 'sonner';

export function usePayments(filters?: PaymentFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.PAYMENTS, filters],
        queryFn: () => paymentsService.getAll(filters),
    });
}

export function useRevenueStats() {
    return useQuery({
        queryKey: [QUERY_KEYS.PAYMENTS, 'stats'],
        queryFn: () => paymentsService.getStats(),
    });
}

export function useRetryPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: paymentsService.retryPayment,
        onSuccess: () => {
            toast.success('Retry initiated (Stub)');
        },
        onError: (error) => {
            toast.error(`Retry failed: ${error.message}`);
        }
    });
}
