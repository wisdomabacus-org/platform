
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Settings, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { MockTest } from '../types/mock-test.types';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useUpdateMockTest, useDeleteMockTest } from '../hooks/use-mock-tests';

const MockTestRowActions = ({ mt }: { mt: MockTest }) => {
  const { mutate: updateMockTest } = useUpdateMockTest();
  const { mutate: deleteMockTest } = useDeleteMockTest();

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
        <DropdownMenuItem asChild>
          <Link to={`/mock-tests/${mt.id}/edit`} className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Edit Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/mock-tests/${mt.id}/questions`} className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> Manage Questions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateMockTest({ id: mt.id, data: { is_published: !mt.is_published } })}
          className="flex items-center gap-2"
        >
          {mt.is_published ? 'Unpublish' : 'Publish'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (confirm('Are you sure you want to delete this mock test?')) {
              deleteMockTest(mt.id);
            }
          }}
          className="text-destructive flex items-center gap-2"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const mockTestColumns: ColumnDef<MockTest>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('title')}</span>
        <span className="text-muted-foreground text-xs line-clamp-1">{row.original.description}</span>
      </div>
    ),
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty') as string;
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Beginner': 'secondary',
        'Intermediate': 'default',
        'Advanced': 'outline',
        'Expert': 'destructive'
      };
      return (
        <Badge variant={variants[difficulty] || 'outline'}>
          {difficulty}
        </Badge>
      );
    },
  },
  {
    id: 'grade',
    header: 'Grade Range',
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.min_grade} - {row.original.max_grade}
      </span>
    )
  },
  {
    accessorKey: 'total_questions',
    header: 'Questions',
    cell: ({ row }) => (
      <span className="text-sm font-mono">{row.getValue('total_questions')}</span>
    )
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue('duration')}m</span>
    )
  },
  {
    accessorKey: 'is_locked',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant={row.getValue('is_locked') ? 'destructive' : 'secondary'}>
        {row.getValue('is_locked') ? 'Paid' : 'Free'}
      </Badge>
    ),
  },
  {
    accessorKey: 'is_published',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('is_published') ? 'default' : 'outline'}>
        {row.getValue('is_published') ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return (
        <span className="text-xs text-muted-foreground">
          {date.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => <MockTestRowActions mt={row.original} />,
  },
];
