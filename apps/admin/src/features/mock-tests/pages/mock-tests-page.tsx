import { useMemo } from 'react';
import { MockTestsHeader } from '../components/header';
import { MockTestsDataTable } from '../components/data-table';
import { mockTestColumns } from '../components/columns';
import { useMockTests } from '../hooks/use-mock-tests';
import { Loader2 } from 'lucide-react';

export default function MockTestsPage() {
  const { data: mockTests, isLoading } = useMockTests();

  const data = useMemo(() => mockTests || [], [mockTests]);

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <MockTestsHeader />
      <MockTestsDataTable columns={mockTestColumns} data={data} pageSize={10} />
    </div>
  );
}
