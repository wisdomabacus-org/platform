import { MockTest } from '../types/mock-test.types';

function dateMinus(days: number) {
  return new Date(Date.now() - days * 86400000);
}

export const mockMockTests: MockTest[] = Array.from({ length: 48 }).map((_, i) => {
  const free = i % 5 === 0;
  const published = i % 3 !== 0;
  return {
    id: `${8000 + i}`,
    title: `Mock Test ${i + 1}`,
    gradeLevel: ((i % 12) + 1),
    isFree: free,
    durationMinutes: 30 + (i % 4) * 15,
    isPublished: published,
    questionsCount: 20 + (i % 3) * 10,
    createdAt: dateMinus(i),
  };
});
