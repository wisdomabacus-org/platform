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
    slug: `abacus-championship-${i + 1}`,
    season: '2024',
    description: 'Annual abacus competition for grades 1-10.',
    original_fee: 200,
    enrollment_fee: 100 + (i % 5) * 50,
    is_published: published,
    is_results_published: results,
    registration_start_date: regStart.toISOString(),
    registration_end_date: regEnd.toISOString(),
    exam_date: compDate.toISOString(),
    exam_window_start: compDate.toISOString(),
    exam_window_end: datePlus(8 + i).toISOString(),
    duration: 90,
    min_grade: (i % 10) + 1,
    max_grade: ((i + 2) % 10) + 1,
    is_featured: i % 5 === 0,
    created_at: datePlus(-30 - i).toISOString(),
    updated_at: datePlus(-1).toISOString(),
    status: i % 2 === 0 ? 'open' : 'upcoming',
    enrolled_count: 0,
    view_count: 0,
    seats_limit: 100,
    waitlist_count: 0,
    total_marks: 100,
    total_questions: 50,
    is_training_available: false,
    results_date: null,
  };
});
