import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { MockTestAttempt } from '../api/mock-test-attempts.service';

interface AttemptsTableProps {
  data: MockTestAttempt[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onDelete?: (attempt: MockTestAttempt) => void;
  isLoading?: boolean;
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  if (percentage >= 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  if (percentage >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
};

const columns: ColumnDef<MockTestAttempt>[] = [
  {
    accessorKey: 'userName',
    header: 'Student',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.userName}</div>
        <div className="text-xs text-muted-foreground">{row.original.userPhone}</div>
      </div>
    ),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const percentage = row.original.percentage;
      return (
        <div className="flex items-center gap-2">
          <Badge className={getScoreColor(percentage)} variant="secondary">
            {row.original.score} / {row.original.totalMarks}
          </Badge>
          <span className="text-sm text-muted-foreground">({percentage}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'correctAnswers',
    header: 'Results',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-emerald-600">{row.original.correctAnswers} ✓</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-red-600">{row.original.incorrectAnswers} ✗</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">{row.original.unanswered} —</span>
      </div>
    ),
  },
  {
    accessorKey: 'timeTaken',
    header: 'Time Taken',
    cell: ({ row }) => {
      const minutes = Math.floor(row.original.timeTaken / 60);
      const seconds = row.original.timeTaken % 60;
      return (
        <span className="text-sm">
          {minutes}m {seconds}s
        </span>
      );
    },
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(row.original.submittedAt, 'MMM d, yyyy HH:mm')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === 'completed' ? 'default' : status === 'in-progress' ? 'secondary' : 'outline';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row, table }) => {
      const attempt = row.original;
      const onDelete = (table.options.meta as any)?.onDelete;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('View attempt', attempt.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(attempt)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Attempt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function AttemptsTable({ 
  data, 
  total, 
  page, 
  limit, 
  onPageChange, 
  onDelete,
  isLoading 
}: AttemptsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={total}
      pagination={{ pageIndex: page, pageSize: limit }}
      onPaginationChange={(pagination) => onPageChange(pagination.pageIndex)}
      meta={{ onDelete }}
      isLoading={isLoading}
    />
  );
}
