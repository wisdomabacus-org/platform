
import { useState } from 'react';
import { PaymentsHeader } from '../components/header';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { paymentColumns } from '../components/columns';
import { usePayments } from '../hooks/use-payments';
import { RevenueAnalytics } from '../components/revenue-analytics';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function PaymentsPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filters = {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search,
    status: status === 'all' ? undefined : status
  };

  const { data: response, isLoading } = usePayments(filters);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
      <PaymentsHeader />
      <RevenueAnalytics />

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IDs, Orders, Payments..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
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
          columns={paymentColumns}
          data={response?.data || []}
          rowCount={response?.total || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}
