import { createClient as createServerClient } from '@/lib/supabase/server';
import type { MockTest } from '@/types/mock-test';

/**
 * Server-side: Get all published mock tests
 * Use this in Server Components only
 */
export async function getAllMockTestsServer(): Promise<MockTest[]> {
    try {
        const supabase = await createServerClient();

        const { data, error } = await supabase
            .from('mock_tests')
            .select('*')
            .eq('is_published', true)
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching mock tests:', error);
            return [];
        }

        return (data || []).map((test: any) => ({
            id: test.id,
            title: test.title,
            description: test.description || '',
            totalQuestions: test.total_questions || 0,
            totalMarks: test.total_questions || 0,
            duration: test.duration || 0,
            minGrade: test.min_grade || 0,
            maxGrade: test.max_grade || 12,
            difficulty: test.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' | undefined,
            isPublished: test.is_published ?? false,
            isLocked: test.is_locked ?? false,
            isFree: !(test.is_locked ?? false),
            sortOrder: test.sort_order || 0,
            createdAt: test.created_at || new Date().toISOString(),
            updatedAt: test.updated_at || new Date().toISOString(),
        }));
    } catch (error) {
        console.error('Failed to fetch mock tests:', error);
        return [];
    }
}
