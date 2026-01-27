
import { supabase } from '@/lib/supabase';
import { MockTest } from '../types/mock-test.types';

export const mockTestsService = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('mock_tests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            gradeLevel: parseInt(item.difficulty) || 0, // mapping difficulty string to grade number
            isFree: !item.is_locked, // mapping locked to paid/free
            durationMinutes: item.duration,
            isPublished: item.is_active, // mapping active to published
            questionsCount: item.total_questions || 0,
            createdAt: new Date(item.created_at)
        })) as MockTest[];
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('mock_tests')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            gradeLevel: parseInt(data.difficulty) || 0,
            isFree: !data.is_locked,
            durationMinutes: data.duration,
            isPublished: data.is_active,
            description: data.description,
            createdAt: new Date(data.created_at || new Date().toISOString())
        } as MockTest & { description?: string };
    },

    create: async (mockTest: Partial<MockTest> & { description?: string }) => {
        const payload: any = {
            title: mockTest.title,
            difficulty: mockTest.gradeLevel?.toString() || '1',
            is_locked: !mockTest.isFree,
            duration: mockTest.durationMinutes || 60,
            is_active: mockTest.isPublished,
            description: mockTest.description || '',
            total_questions: 0 // defaults
        };

        const { data, error } = await supabase
            .from('mock_tests')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async (id: string, updates: Partial<MockTest> & { description?: string }) => {
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.gradeLevel !== undefined) payload.difficulty = updates.gradeLevel.toString();
        if (updates.isFree !== undefined) payload.is_locked = !updates.isFree;
        if (updates.durationMinutes !== undefined) payload.duration = updates.durationMinutes;
        if (updates.isPublished !== undefined) payload.is_active = updates.isPublished;
        if (updates.description !== undefined) payload.description = updates.description;

        const { data, error } = await supabase
            .from('mock_tests')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('mock_tests')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
