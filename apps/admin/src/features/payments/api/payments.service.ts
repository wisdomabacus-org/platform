
import { supabase } from '@/lib/supabase';
import { Payment, PaymentFilters, RevenueStats } from '../types/payment.types';

export const paymentsService = {
    getAll: async (filters?: PaymentFilters) => {
        let query = supabase
            .from('payments')
            .select(`
        *,
        profile:profiles(student_name, phone, email)
      `, { count: 'exact' });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.search) {
            const s = `%${filters.search}%`;
            // Search in payment fields or joined user fields
            // Typically needs an OR with joined fields which is tricky without !inner or RPC
            // For MVP, we search payment IDs and gateway IDs.
            query = query.or(`id.ilike.${s},razorpay_order_id.ilike.${s},razorpay_payment_id.ilike.${s}`);
        }

        if (filters?.dateRange?.from) {
            query = query.gte('created_at', filters.dateRange.from.toISOString());
        }
        if (filters?.dateRange?.to) {
            query = query.lte('created_at', filters.dateRange.to.toISOString());
        }

        // Default sorting
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                userName: p.profile?.student_name || '—',
                userPhone: p.profile?.phone || '—',
                amount: p.amount,
                currency: p.currency || 'INR',
                status: p.status,
                purpose: p.purpose,
                referenceId: p.reference_id,
                gateway: p.gateway,
                razorpayOrderId: p.razorpay_order_id,
                razorpayPaymentId: p.razorpay_payment_id,
                failureReason: p.failure_reason,
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at || p.created_at),
                userSnapshot: p.user_snapshot,
            })) as Payment[],
            count
        };
    },

    getStats: async (): Promise<RevenueStats> => {
        // This aggregation ideally should happen on the server via RPC or Edge Function for scale.
        // For MVP with < 10k rows, we can fetch light data or use simplified queries.

        // We'll Fetch counts for each status
        // Note: 'count' method with 'head: true' is efficient.

        // Total Revenue (only success)
        // Supabase JS doesn't do SUM easily without RPC.
        // We'll mock the SUM logic or fetch 'amount' column for 'success' rows.

        const { data: successData, error: successError } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'success');

        if (successError) throw successError;

        const totalRevenue = successData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const successfulCount = successData.length;

        const { count: pendingCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: failedCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'failed');

        return {
            totalRevenue,
            successfulCount,
            pendingCount: pendingCount || 0,
            failedCount: failedCount || 0
        };
    },

    retryPayment: async (id: string) => {
        // Logic to retry payment or check status with Gateway
        // For now, just a stub
        console.log('Retrying payment', id);
    }
};
