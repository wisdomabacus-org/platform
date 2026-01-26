import { Competition } from '../types/competition.types';

function datePlus(days: number) {
  return new Date(Date.now() + days * 86400000);
}

export const mockCompetitions: Competition[] = Array.from({ length: 42 }).map((_, i) => {
  const regStart = datePlus(-10 + i);
  const regEnd = datePlus(5 + i);
  const compDate = datePlus(7 + i);

  const published = i % 3 !== 0;
  const results = published && i % 4 === 0;

  return {
    id: `${1000 + i}`,
    title: `Abacus Championship ${i + 1}`,
    applicableGrades: [((i % 10) + 1), (((i + 2) % 10) + 1)].sort((a, b) => a - b),
    description: 'Annual abacus competition for grades 1-10.',
    prizeDetails: i % 2 === 0 ? 'Medals and certificates' : undefined,
    enrollmentFee: 100 + (i % 5) * 50,
    type: i % 5 === 0 ? 'MOCK' : 'ACTUAL',
    isPublished: published,
    isResultsPublished: results,
    registrationStartDate: regStart,
    registrationEndDate: regEnd,
    competitionDate: compDate,
    examStartTime: '10:00',
    examEndTime: '11:30',
    resultsAnnouncementDate: datePlus(10 + i),
    durationMinutes: 90,
    questions: [],
    createdBy: 'admin1',
    createdAt: datePlus(-30 - i),
    updatedAt: datePlus(-1),
  };
});
