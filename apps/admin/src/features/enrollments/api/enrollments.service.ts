
import { supabase } from '@/lib/supabase';
import { Enrollment, EnrollmentFilters } from '../types/enrollment.types';

export const enrollmentsService = {
    getAll: async (filters?: EnrollmentFilters) => {
        let query = supabase
            .from('enrollments')
            .select(`
        *,
        profile:profiles(student_name, phone, uid),
        competition:competitions(title, season)
      `, { count: 'exact' });

        if (filters?.competitionId) {
            query = query.eq('competition_id', filters.competitionId);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.isPaymentConfirmed !== undefined) {
            query = query.eq('is_payment_confirmed', filters.isPaymentConfirmed);
        }

        if (filters?.search) {
            // Filter by joined profile name (requires embedding filtering or separate search ID)
            // Supabase filtering on joined tables by '!inner' is possible, but let's keep it simple for now and just check IDs 
            // or handle advanced search if needed. For now, simple text search on top-level or limited.
            // Actually, let's skip searching on joined tables for MVP unless strictly requested, 
            // as it requires specific syntax like `profile!inner(student_name.ilike.%...%)`.
        }

        // Default sorting
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data.map((e: any) => ({
                id: e.id,
                userId: e.user_id,
                userName: e.profile?.student_name || '—',
                userPhone: e.profile?.phone || '—',
                competitionId: e.competition_id,
                competitionTitle: e.competition?.title || 'Unknown',
                competitionSeason: e.competition?.season || '',
                status: e.status,
                paymentId: e.payment_id,
                isPaymentConfirmed: e.is_payment_confirmed || false,
                submissionId: e.submission_id,
                registeredAt: new Date(e.created_at),
            })) as Enrollment[],
            count
        };
    },

    create: async (payload: { userId: string; competitionId: string; paymentId?: string }) => {
        // Manual enrollment often means bypassing payment or recording an external one.
        // We'll set payment_id to 'MANUAL-{Date}' if not provided.
        const paymentId = payload.paymentId || `MANUAL-${Date.now()}`;

        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                user_id: payload.userId,
                competition_id: payload.competitionId,
                payment_id: paymentId,
                is_payment_confirmed: true, // Manual assumption
                status: 'enrolled'
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
