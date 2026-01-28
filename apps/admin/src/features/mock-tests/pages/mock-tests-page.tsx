import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { useMockTests } from '../hooks/use-mock-tests';
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
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, FileQuestion, Eye, Lock } from 'lucide-react';
import { useUpdateMockTest, useDeleteMockTest } from '../hooks/use-mock-tests';
import { MockTest } from '../types/mock-test.types';
import { cn } from '@/lib/utils';

// Difficulty badge colors
const DIFFICULTY_COLORS: Record<string, { color: string; bgColor: string }> = {
  Beginner: { color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  Intermediate: { color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  Advanced: { color: 'text-orange-700', bgColor: 'bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
  Expert: { color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
};

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Mock Test</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MockTestRowActions({ mockTest }: { mockTest: MockTest }) {
  const navigate = useNavigate();
  const { mutate: updateMockTest } = useUpdateMockTest();
  const { mutate: deleteMockTest } = useDeleteMockTest();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES.MOCK_TESTS_DETAIL.replace(':id', mockTest.id));
        }}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES.MOCK_TESTS_EDIT.replace(':id', mockTest.id));
        }}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES.MOCK_TESTS_QUESTIONS.replace(':id', mockTest.id));
        }}>
          <FileQuestion className="mr-2 h-4 w-4" />
          Questions
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            updateMockTest({ id: mockTest.id, data: { is_published: !mockTest.is_published } });
          }}
        >
          {mockTest.is_published ? 'Unpublish' : 'Publish'}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this mock test?')) {
              deleteMockTest(mockTest.id);
            }
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MockTestsPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');

  const { data: result, isLoading, isFetching } = useMockTests({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    difficulty: difficulty === 'all' ? undefined : difficulty,
  });

  const mockTests = result?.data || [];
  const isTableLoading = isLoading || (isFetching && mockTests.length === 0);

  const handleRowClick = (id: string) => {
    navigate(ROUTES.MOCK_TESTS_DETAIL.replace(':id', id));
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <PageHeader title="Mock Tests" description="Manage practice tests for students.">
        <Button onClick={() => navigate(ROUTES.MOCK_TESTS_CREATE)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Mock Test
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mock tests..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={difficulty}
            onValueChange={(val) => {
              setDifficulty(val);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="All Difficulties" />
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
      </div>

      {/* Table */}
      {isTableLoading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Mock Test</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No mock tests found.
                  </TableCell>
                </TableRow>
              ) : (
                mockTests.map((mt) => {
                  const difficultyStyle = DIFFICULTY_COLORS[mt.difficulty] || DIFFICULTY_COLORS.Beginner;
                  return (
                    <TableRow
                      key={mt.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(mt.id)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{mt.title}</span>
                            {mt.is_locked && (
                              <Lock className="h-3.5 w-3.5 text-amber-600" />
                            )}
                          </div>
                          {mt.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {mt.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn('text-xs font-medium', difficultyStyle.bgColor, difficultyStyle.color)}
                        >
                          {mt.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {mt.min_grade} - {mt.max_grade}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {mt.total_questions}
                      </TableCell>
                      <TableCell className="text-sm">
                        {mt.duration}m
                      </TableCell>
                      <TableCell>
                        <Badge variant={mt.is_published ? 'default' : 'outline'} className="text-xs">
                          {mt.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <MockTestRowActions mockTest={mt} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination info */}
      {result && result.total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, result.total)} of {result.total} results
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageIndex === 0}
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(pagination.pageIndex + 1) * pagination.pageSize >= result.total}
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
