
import { supabase } from '@/lib/supabase';
import { Enrollment, EnrollmentFilters } from '../types/enrollment.types';

export const enrollmentsService = {
    getAll: async (filters: EnrollmentFilters = {}) => {
        const { competitionId, status, isPaymentConfirmed, page = 0, limit = 10 } = filters;

        // Use explicit FK references for joins
        // profiles via user_id, competitions via competition_id
        let query = supabase
            .from('enrollments')
            .select(`
                *,
                profiles!user_id(student_name, phone, uid),
                competitions!competition_id(title, season)
            `, { count: 'exact' });

        if (competitionId) {
            query = query.eq('competition_id', competitionId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (isPaymentConfirmed !== undefined) {
            query = query.eq('is_payment_confirmed', isPaymentConfirmed);
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            data: (data || []).map((e: any) => ({
                id: e.id,
                userId: e.user_id,
                // Use 'profiles' (table name) since we use explicit FK reference without alias
                userName: e.profiles?.student_name || '—',
                userPhone: e.profiles?.phone || '—',
                competitionId: e.competition_id,
                // Use 'competitions' (table name) since we use explicit FK reference without alias
                competitionTitle: e.competitions?.title || 'Unknown',
                competitionSeason: e.competitions?.season || '',
                status: e.status,
                paymentId: e.payment_id,
                isPaymentConfirmed: e.is_payment_confirmed || false,
                submissionId: e.submission_id,
                registeredAt: new Date(e.created_at),
            })) as Enrollment[],
            total: count || 0,
            page,
            limit
        };
    },

    create: async (payload: { userId: string; competitionId: string; paymentId?: string }) => {
        let finalPaymentId = payload.paymentId;

        // If no paymentId, create a manual record in payments table
        if (!finalPaymentId) {
            const { data: payData, error: payError } = await supabase
                .from('payments')
                .insert({
                    user_id: payload.userId,
                    amount: 0,
                    status: 'SUCCESS',
                    purpose: 'COMPETITION_ENROLLMENT',
                    reference_id: payload.competitionId,
                    gateway: 'OFFLINE'
                })
                .select()
                .single();

            if (payError) throw payError;
            finalPaymentId = payData.id;
        }

        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                user_id: payload.userId,
                competition_id: payload.competitionId,
                payment_id: finalPaymentId,
                is_payment_confirmed: true,
                status: 'confirmed'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateStatus: async (id: string, status: string) => {
        const { error } = await supabase
            .from('enrollments')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
