import { CompetitionResultsRow } from '../types/results.types';

function dateMinus(days: number) {
  return new Date(Date.now() - days * 86400000);
}

export const mockResultsRows: CompetitionResultsRow[] = Array.from({ length: 36 }).map((_, i) => {
  const published = i % 3 !== 0;
  return {
    id: `${9000 + i}`,
    competitionId: `c${i + 1}`,
    competitionTitle: `Abacus Cup ${i + 1}`,
    grades: [((i % 10) + 1), ((i + 3) % 10) + 1].sort((a, b) => a - b),
    status: published ? 'published' : 'pending',
    publishedAt: published ? dateMinus(i) : undefined,
    totalParticipants: 100 + (i % 7) * 23,
  };
});
