import { useMemo } from 'react';
import { CompetitionsHeader } from '../components/header';
import { mockCompetitions } from '../components/mock';
import { CompetitionsDataTable } from '../components/data-table';
import { competitionColumns } from '../components/columns';

export default function CompetitionsPage() {
  const data = useMemo(() => mockCompetitions, []);

  return (
    <div className="w-full flex flex-col h-screen max-h-screen overflow-y-scroll scrollbar-hide gap-y-4 px-8 py-4">
      <CompetitionsHeader />
      <CompetitionsDataTable columns={competitionColumns} data={data} pageSize={10} />
    </div>
  );
}
