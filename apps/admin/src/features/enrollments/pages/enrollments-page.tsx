
import { useMemo } from 'react';
import { EnrollmentsHeader } from '../components/header';
import { EnrollmentsDataTable } from '../components/data-table';
import { enrollmentColumns } from '../components/columns';
import { useEnrollments } from '../hooks/use-enrollments';
import { Loader2 } from 'lucide-react';

export default function EnrollmentsPage() {
  const { data: enrollmentsData, isLoading } = useEnrollments();
  const data = useMemo(() => enrollmentsData?.data || [], [enrollmentsData]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <EnrollmentsHeader />
      <EnrollmentsDataTable columns={enrollmentColumns} data={data} pageSize={10} />
    </div>
  );
}
