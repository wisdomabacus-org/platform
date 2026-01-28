import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { useCompetitions } from '../hooks/use-competitions';
import { Button } from '@/shared/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { CompetitionFilters } from '../types/competition.types';
import { columns } from '../components/competitions-columns';
import { DataTable } from '../components/data-table';
import { Skeleton } from '@/shared/components/ui/skeleton';

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="rounded-md border">
        <div className="border-b p-4">
          <Skeleton className="h-4 w-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompetitionsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CompetitionFilters>({
    search: '',
    status: undefined,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data: competitionsData, isLoading, isFetching } = useCompetitions({
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const handleRowClick = (id: string) => {
    navigate(ROUTES.COMPETITIONS_DETAIL.replace(':id', id));
  };

  const handleCreateClick = () => {
    navigate(ROUTES.COMPETITIONS_CREATE);
  };

  const competitions = competitionsData?.data || [];
  const totalCount = competitionsData?.count || 0;
  const isTableLoading = isLoading || (isFetching && competitions.length === 0);

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <PageHeader title="Competitions" description="Manage your math olympiads and competitions.">
        <Button onClick={handleCreateClick} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Competition
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search competitions..."
            value={filters.search}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, search: e.target.value }));
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filters.status?.[0] || 'all'}
            onValueChange={(val) => {
              setFilters((prev) => ({
                ...prev,
                status: val === 'all' ? undefined : [val],
              }));
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {isTableLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={competitions}
          onRowClick={(row) => handleRowClick(row.id)}
          pageCount={Math.ceil(totalCount / pagination.pageSize)}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}
