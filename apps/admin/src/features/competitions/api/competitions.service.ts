import { supabase } from '@/lib/supabase';
import { Competition, CompetitionInsert, CompetitionUpdate, CompetitionFilters } from '../types/competition.types';
import { extractErrorMessage } from '@/lib/error-handler';

export const competitionsService = {
    /**
     * Fetch all competitions with optional filters and pagination
     */
    getAll: async (filters?: CompetitionFilters & { page?: number; limit?: number }) => {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('competitions')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (filters?.status && filters.status.length > 0) {
            query = query.in('status', filters.status);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
        }

        if (filters?.season) {
            query = query.eq('season', filters.season);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching competitions:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return {
            data: data as Competition[],
            count: count || 0,
        };
    },

    /**
     * Get competition by ID with syllabus and prizes
     */
    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .select(`
                *,
                competition_syllabus (*),
                competition_prizes (*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching competition:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    /**
     * Create a new competition
     */
    create: async (competition: CompetitionInsert) => {
        const { data, error } = await supabase
            .from('competitions')
            .insert(competition)
            .select()
            .single();

        if (error) {
            console.error('Error creating competition:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data as Competition;
    },

    /**
     * Update a competition
     */
    update: async (id: string, updates: CompetitionUpdate) => {
        const { data, error } = await supabase
            .from('competitions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating competition:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data as Competition;
    },

    /**
     * Delete a competition
     */
    delete: async (id: string) => {
        const { error } = await supabase
            .from('competitions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting competition:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return true;
    },

    /**
     * Update competition syllabus
     */
    updateSyllabus: async (competitionId: string, topics: any[]) => {
        // First delete existing syllabus
        const { error: deleteError } = await supabase
            .from('competition_syllabus')
            .delete()
            .eq('competition_id', competitionId);

        if (deleteError) {
            console.error('Error deleting syllabus:', deleteError);
            throw new Error(extractErrorMessage(deleteError));
        }

        // Then insert new ones
        if (topics.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_syllabus')
            .insert(topics.map((t, index) => ({
                ...t,
                competition_id: competitionId,
                sort_order: t.sort_order ?? index
            })))
            .select();

        if (error) {
            console.error('Error inserting syllabus:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    /**
     * Update competition prizes
     */
    updatePrizes: async (competitionId: string, prizes: any[]) => {
        // First delete existing prizes
        const { error: deleteError } = await supabase
            .from('competition_prizes')
            .delete()
            .eq('competition_id', competitionId);

        if (deleteError) {
            console.error('Error deleting prizes:', deleteError);
            throw new Error(extractErrorMessage(deleteError));
        }

        // Then insert new ones
        if (prizes.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_prizes')
            .insert(prizes.map(p => ({
                ...p,
                competition_id: competitionId
            })))
            .select();

        if (error) {
            console.error('Error inserting prizes:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    /**
     * Get assigned question banks
     */
    getQuestionBanks: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('competition_question_banks')
            .select(`
                *,
                question_banks (*)
            `)
            .eq('competition_id', competitionId);

        if (error) {
            console.error('Error fetching question banks:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    /**
     * Assign question banks to competition
     */
    assignQuestionBanks: async (competitionId: string, assignments: { question_bank_id: string, grades: number[] }[]) => {
        // First clear existing assignments
        const { error: deleteError } = await supabase
            .from('competition_question_banks')
            .delete()
            .eq('competition_id', competitionId);

        if (deleteError) {
            console.error('Error clearing question banks:', deleteError);
            throw new Error(extractErrorMessage(deleteError));
        }

        if (assignments.length === 0) return [];

        const { data, error } = await supabase
            .from('competition_question_banks')
            .insert(assignments.map(a => ({
                competition_id: competitionId,
                question_bank_id: a.question_bank_id,
                grades: a.grades
            })))
            .select();

        if (error) {
            console.error('Error assigning question banks:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    /**
     * Get participants/enrollments for a competition
     */
    getParticipants: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                profiles!user_id(id, student_name, phone, email, uid),
                payments!payment_id(id, status, amount)
            `)
            .eq('competition_id', competitionId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching participants:', error);
            throw new Error(extractErrorMessage(error));
        }

        // Map the data to a cleaner format
        return (data || []).map((e: any) => ({
            id: e.id,
            userId: e.user_id,
            userName: e.profiles?.student_name || e.profiles?.email || 'Unknown',
            userPhone: e.profiles?.phone || '—',
            userUid: e.profiles?.uid || '—',
            status: e.status,
            paymentStatus: e.payments?.status || '—',
            paymentAmount: e.payments?.amount || 0,
            isPaymentConfirmed: e.is_payment_confirmed,
            submissionId: e.submission_id,
            enrolledAt: new Date(e.created_at),
        }));
    },

    /**
     * Get revenue statistics for a competition
     */
    getRevenueStats: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                is_payment_confirmed,
                payments!payment_id(amount, status)
            `)
            .eq('competition_id', competitionId)
            .eq('is_payment_confirmed', true);

        if (error) {
            console.error('Error fetching revenue stats:', error);
            throw new Error(extractErrorMessage(error));
        }

        const confirmedPayments = (data || []).filter((e: any) => 
            e.is_payment_confirmed && e.payments?.status === 'SUCCESS'
        );

        const totalRevenue = confirmedPayments.reduce((sum: number, e: any) => 
            sum + (e.payments?.amount || 0), 0
        );

        return {
            totalRevenue,
            confirmedCount: confirmedPayments.length,
        };
    },
};
