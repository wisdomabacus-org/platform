import { MockTest } from '../types/mock-test.types';

function dateMinus(days: number) {
  return new Date(Date.now() - days * 86400000);
}

export const mockMockTests: MockTest[] = Array.from({ length: 48 }).map((_, i) => {
  const published = i % 3 !== 0;
  return {
    id: `${8000 + i}`,
    title: `Mock Test ${i + 1}`,
    description: 'Practice test for mental math.',
    difficulty: (['Beginner', 'Intermediate', 'Advanced', 'Expert'][i % 4] as any),
    duration: 30 + (i % 4) * 15,
    total_questions: 20 + (i % 3) * 10,
    min_grade: (i % 12) + 1,
    max_grade: (i % 12) + 1,
    is_active: true,
    is_published: published,
    is_locked: false,
    attempt_count: 0,
    tags: ['math', 'abacus'],
    sort_order: i,
    created_at: dateMinus(i).toISOString(),
    updated_at: dateMinus(i).toISOString(),
  };
});
