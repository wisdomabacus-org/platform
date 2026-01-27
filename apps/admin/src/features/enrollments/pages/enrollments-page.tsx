
import { useState } from 'react';
import { EnrollmentsHeader } from '../components/header';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { enrollmentColumns } from '../components/columns';
import { useEnrollments } from '../hooks/use-enrollments';
import { useCompetitions } from '@/features/competitions/hooks/use-competitions';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function EnrollmentsPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [competitionId, setCompetitionId] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const filters = {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    competitionId: competitionId === 'all' ? undefined : competitionId,
    status: status === 'all' ? undefined : status,
  };

  const { data: response, isLoading } = useEnrollments(filters);
  const { data: competitionsData } = useCompetitions({ limit: 100 }); // For filter dropdown

  const handleCompetitionChange = (val: string) => {
    setCompetitionId(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
      <EnrollmentsHeader />

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Select value={competitionId} onValueChange={handleCompetitionChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitions</SelectItem>
              {competitionsData?.data?.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={enrollmentColumns}
          data={response?.data || []}
          rowCount={response?.total || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}
