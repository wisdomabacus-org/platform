import { useMemo } from 'react';
import { ResultsHeader } from '../components/header';
import { ResultsDataTable } from '../components/data-table';
import { resultsColumns } from '../components/columns';
import { mockResultsRows } from '../components/mock';

export default function ResultsPage() {
  const data = useMemo(() => mockResultsRows, []);
  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <ResultsHeader />
      <ResultsDataTable columns={resultsColumns} data={data} pageSize={10} />
    </div>
  );
}
