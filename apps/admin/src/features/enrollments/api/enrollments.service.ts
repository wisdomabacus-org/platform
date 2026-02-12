import { supabase } from '@/lib/supabase';
import { Enrollment, EnrollmentFilters } from '../types/enrollment.types';
import { extractErrorMessage } from '@/lib/error-handler';

export const enrollmentsService = {
    getAll: async (filters: EnrollmentFilters = {}) => {
        const { competitionId, status, isPaymentConfirmed, page = 0, limit = 10 } = filters;

        // Build the query with explicit FK references for joins
        let query = supabase
            .from('enrollments')
            .select(`
                *,
                profiles!user_id(id, student_name, phone, uid, email),
                competitions!competition_id(id, title, season),
                payments!payment_id(id, status, amount)
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

        if (error) {
            console.error('Error fetching enrollments:', error);
            throw new Error(extractErrorMessage(error));
        }

        // Map the joined data to a cleaner format
        const mappedData = (data || []).map((e: any) => ({
            id: e.id,
            userId: e.user_id,
            // Handle profiles data - note: the FK relationship returns profiles as an object or array
            userName: e.profiles?.student_name || e.profiles?.email || 'Unknown User',
            userPhone: e.profiles?.phone || '—',
            userUid: e.profiles?.uid || '—',
            competitionId: e.competition_id,
            competitionTitle: e.competitions?.title || 'Unknown Competition',
            competitionSeason: e.competitions?.season || '',
            status: e.status,
            paymentId: e.payment_id,
            paymentStatus: e.payments?.status || '—',
            paymentAmount: e.payments?.amount || 0,
            isPaymentConfirmed: e.is_payment_confirmed || false,
            submissionId: e.submission_id,
            registeredAt: new Date(e.created_at),
        })) as Enrollment[];

        return {
            data: mappedData,
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

            if (payError) {
                console.error('Error creating payment:', payError);
                throw new Error(extractErrorMessage(payError));
            }
            
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
            .select(`
                *,
                profiles!user_id(student_name, phone),
                competitions!competition_id(title, season)
            `)
            .single();

        if (error) {
            console.error('Error creating enrollment:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    updateStatus: async (id: string, status: string) => {
        const { error } = await supabase
            .from('enrollments')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating enrollment status:', error);
            throw new Error(extractErrorMessage(error));
        }
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('enrollments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting enrollment:', error);
            throw new Error(extractErrorMessage(error));
        }
    },

    // Get a single enrollment by ID with full details
    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                profiles!user_id(*),
                competitions!competition_id(*),
                payments!payment_id(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching enrollment:', error);
            throw new Error(extractErrorMessage(error));
        }

        return {
            id: data.id,
            userId: data.user_id,
            userName: data.profiles?.student_name || data.profiles?.email || 'Unknown',
            userPhone: data.profiles?.phone || '—',
            competitionId: data.competition_id,
            competitionTitle: data.competitions?.title || 'Unknown',
            competitionSeason: data.competitions?.season || '',
            status: data.status,
            paymentId: data.payment_id,
            paymentStatus: data.payments?.status || '—',
            paymentAmount: data.payments?.amount || 0,
            isPaymentConfirmed: data.is_payment_confirmed || false,
            submissionId: data.submission_id,
            registeredAt: new Date(data.created_at),
        };
    },
};
