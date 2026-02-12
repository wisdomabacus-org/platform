import { supabase } from '@/lib/supabase';
import { MockTest, MockTestFilters, MockTestAssignment } from '../types/mock-test.types';
import { extractErrorMessage } from '@/lib/error-handler';

export const mockTestsService = {
    getAll: async (filters?: MockTestFilters) => {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('mock_tests')
            .select('*', { count: 'exact' })
            .order('sort_order', { ascending: true })
            .range(from, to);

        if (filters?.difficulty) {
            query = query.eq('difficulty', filters.difficulty);
        }

        if (filters?.is_published !== undefined) {
            query = query.eq('is_published', filters.is_published);
        }

        if (filters?.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching mock tests:', error);
            throw new Error(extractErrorMessage(error));
        }

        return {
            data: data as MockTest[],
            total: count || 0,
            page,
            limit
        };
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('mock_tests')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching mock test:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data as MockTest;
    },

    create: async (data: Partial<MockTest>) => {
        const { data: result, error } = await supabase
            .from('mock_tests')
            .insert(data as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating mock test:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return result as MockTest;
    },

    update: async (id: string, data: Partial<MockTest>) => {
        const { data: result, error } = await supabase
            .from('mock_tests')
            .update(data as any)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating mock test:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return result as MockTest;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('mock_tests')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting mock test:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return true;
    },

    getQuestionBanks: async (mockTestId: string) => {
        const { data, error } = await supabase
            .from('mock_test_question_banks')
            .select('*, question_banks(*)')
            .eq('mock_test_id', mockTestId);

        if (error) {
            console.error('Error fetching question banks:', error);
            throw new Error(extractErrorMessage(error));
        }
        
        return data;
    },

    assignQuestionBanks: async (mockTestId: string, assignments: MockTestAssignment[]) => {
        // Clear existing
        const { error: deleteError } = await supabase
            .from('mock_test_question_banks')
            .delete()
            .eq('mock_test_id', mockTestId);

        if (deleteError) {
            console.error('Error clearing question banks:', deleteError);
            throw new Error(extractErrorMessage(deleteError));
        }

        if (assignments.length === 0) return [];

        const { data, error } = await supabase
            .from('mock_test_question_banks')
            .insert(assignments.map(a => ({
                mock_test_id: mockTestId,
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
};
