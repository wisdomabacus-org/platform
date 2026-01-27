
import { useState } from 'react';
import { PageHeader } from '@/shared/components/page-header';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { columns } from '../components/competitions-columns';
import { useCompetitions } from '../hooks/use-competitions';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Card, CardContent } from '@/shared/components/ui/card';

export default function CompetitionsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CompetitionFilters>({
    search: '',
    status: undefined,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: competitionsData, isLoading } = useCompetitions({
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Competitions"
        description="Manage your math olympiads and competitions."
      >
        <Button onClick={() => navigate(ROUTES.COMPETITIONS_CREATE)}>
          <Plus className="mr-2 h-4 w-4" /> Create Competition
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Filters Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center py-4">
            <Input
              placeholder="Search competitions..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
              }}
              className="max-w-sm"
            />
            <Select
              value={filters.status?.[0] || 'all'}
              onValueChange={(val) => {
                setFilters(prev => ({
                  ...prev,
                  status: val === 'all' ? undefined : [val]
                }));
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Loading competitions...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={competitionsData?.data || []}
              rowCount={competitionsData?.count || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
