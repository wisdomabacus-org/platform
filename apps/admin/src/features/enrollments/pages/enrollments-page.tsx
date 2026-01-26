import { useMemo } from 'react';
import { EnrollmentsHeader } from '../components/header';
import { EnrollmentsDataTable } from '../components/data-table';
import { enrollmentColumns } from '../components/columns';
import { mockEnrollments } from '../components/mock';

export default function EnrollmentsPage() {
  const data = useMemo(() => mockEnrollments, []);
  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <EnrollmentsHeader />
      <EnrollmentsDataTable columns={enrollmentColumns} data={data} pageSize={10} />
    </div>
  );
}
