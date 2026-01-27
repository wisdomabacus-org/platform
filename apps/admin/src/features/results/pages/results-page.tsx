import { useMemo } from 'react';
import { ResultsHeader } from '../components/header';
import { ResultsDataTable } from '../components/data-table';
import { resultsColumns } from '../components/columns';
import { useResultCompetitions } from '../hooks/use-results';
import { CompetitionResultsRow } from '../types/results.types';
import { Loader2 } from 'lucide-react';

export default function ResultsPage() {
  const { data: competitions, isLoading } = useResultCompetitions();

  const data: CompetitionResultsRow[] = useMemo(() => {
    if (!competitions) return [];
    return competitions.map(c => ({
      id: c.id,
      competitionId: c.id,
      competitionTitle: c.title,
      status: (c.status === 'completed' || c.status === 'published') ? 'published' : 'pending',
      grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Placeholder: derive from min/max if available
      publishedAt: c.status === 'completed' ? new Date() : undefined, // Placeholder: need actual date
      totalParticipants: (c as any).enrolled_count || 0
    }));
  }, [competitions]);

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <ResultsHeader />
      <ResultsDataTable columns={resultsColumns} data={data} pageSize={10} />
    </div>
  );
}
