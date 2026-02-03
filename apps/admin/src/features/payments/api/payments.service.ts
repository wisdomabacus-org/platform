import { supabase } from '@/lib/supabase';
import { Payment, PaymentFilters, RevenueStats } from '../types/payment.types';

export const paymentsService = {
    getAll: async (filters: PaymentFilters = {}) => {
        const { status, search, dateRange, page = 0, limit = 10 } = filters;

        // Use explicit FK reference for join: profiles via user_id
        let query = supabase
            .from('payments')
            .select(`
                *,
                profiles!user_id(student_name, phone, email)
            `, { count: 'exact' });

        if (status) {
            // Database uses UPPERCASE status values: SUCCESS, PENDING, FAILED
            query = query.eq('status', status.toUpperCase());
        }

        if (search) {
            const s = `%${search}%`;
            query = query.or(`id.ilike.${s},razorpay_order_id.ilike.${s},razorpay_payment_id.ilike.${s}`);
        }

        if (dateRange?.from) {
            query = query.gte('created_at', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
            query = query.lte('created_at', dateRange.to.toISOString());
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            data: (data || []).map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                // Use 'profiles' (table name) since we use explicit FK reference without alias
                userName: p.profiles?.student_name || '—',
                userPhone: p.profiles?.phone || '—',
                // Amount is stored in paise, convert to rupees for display
                amount: (p.amount || 0) / 100,
                currency: p.currency || 'INR',
                // Normalize status to lowercase for frontend display
                status: (p.status || 'pending').toLowerCase(),
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
            total: count || 0,
            page,
            limit
        };
    },

    getStats: async (): Promise<RevenueStats> => {
        // This aggregation ideally should happen on the server via RPC or Edge Function for scale.
        // For MVP with < 10k rows, we can fetch light data or use simplified queries.

        // We'll Fetch counts for each status
        // Note: 'count' method with 'head: true' is efficient.

        // Total Revenue (only SUCCESS payments)
        // Database uses UPPERCASE status values: SUCCESS, PENDING, FAILED
        const { data: successData, error: successError } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'SUCCESS');

        if (successError) throw successError;

        // Amount is in paise, convert to rupees
        const totalRevenue = successData.reduce((acc, curr) => acc + (curr.amount || 0), 0) / 100;
        const successfulCount = successData.length;

        // Database uses UPPERCASE status values
        const { count: pendingCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
        const { count: failedCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'FAILED');

        return {
            totalRevenue,
            successfulCount,
            pendingCount: pendingCount || 0,
            failedCount: failedCount || 0
        };
    },

    update: async (id: string, data: Partial<Payment>) => {
        // Map types back to DB fields if necessary
        const dbData: any = {};
        if (data.status) dbData.status = data.status;

        const { error } = await supabase
            .from('payments')
            .update(dbData)
            .eq('id', id);

        if (error) throw error;
    },

    retryPayment: async (id: string) => {
        // Logic to retry payment or check status with Gateway
        // For now, just a stub
        console.log('Retrying payment', id);
    }
};
