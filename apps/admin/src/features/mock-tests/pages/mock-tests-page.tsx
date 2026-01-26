import { useMemo } from 'react';
import { MockTestsHeader } from '../components/header';
import { MockTestsDataTable } from '../components/data-table';
import { mockTestColumns } from '../components/columns';
import { mockMockTests } from '../components/mock';

export default function MockTestsPage() {
  const data = useMemo(() => mockMockTests, []);
  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <MockTestsHeader />
      <MockTestsDataTable columns={mockTestColumns} data={data} pageSize={10} />
    </div>
  );
}
