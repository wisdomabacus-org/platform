import { useMemo, useState } from 'react';
import { MockTestsHeader } from '../components/header';
import { mockTestColumns } from '../components/columns';
import { useMockTests } from '../hooks/use-mock-tests';
import { Loader2 } from 'lucide-react';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { PaginationState } from '@tanstack/react-table';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export default function MockTestsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');

  const filters = useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    difficulty: difficulty === 'all' ? undefined : difficulty,
  }), [pagination, search, difficulty]);

  const { data: result, isLoading } = useMockTests(filters);

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const onDifficultyChange = (value: string) => {
    setDifficulty(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  if (isLoading && !result) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <MockTestsHeader />

      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search mock tests..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={mockTestColumns}
        data={result?.data || []}
        rowCount={result?.total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
