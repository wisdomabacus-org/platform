import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { MoreHorizontal, Settings, Check, X, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Competition } from '../types/competition.types';

function currency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
function fmtDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const competitionColumns: ColumnDef<Competition>[] = [
  // Selection column
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 24,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const c = row.original;
      return (
        <Link
          to={`/competitions/${c.id}/settings`}
          className="font-medium hover:underline"
        >
          {c.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'is_published',
    header: 'Status',
    cell: ({ row }) => {
      const p = row.original.is_published;
      return (
        <Badge variant={p ? 'default' : 'secondary'}>{p ? 'Published' : 'Draft'}</Badge>
      );
    },
    size: 110,
  },
  {
    accessorKey: 'min_grade',
    header: 'Grades',
    cell: ({ row }) => `${row.original.min_grade} - ${row.original.max_grade}`,
    size: 120,
  },
  {
    accessorKey: 'enrollment_fee',
    header: 'Fee',
    cell: ({ row }) => currency(Number(row.original.enrollment_fee)),
    size: 90,
  },
  {
    id: 'registration',
    header: 'Registration',
    cell: ({ row }) =>
      `${fmtDate(row.original.registration_start_date)} - ${fmtDate(row.original.registration_end_date)}`,
    size: 220,
  },
  {
    accessorKey: 'exam_date',
    header: 'Exam Date',
    cell: ({ row }) =>
      fmtDate(row.original.exam_date),
    size: 200,
  },
  {
    accessorKey: 'is_results_published',
    header: 'Results',
    cell: ({ row }) => {
      const r = row.original.is_results_published;
      return (
        <Badge variant={r ? 'outline' : 'secondary'}>{r ? 'Published' : 'Pending'}</Badge>
      );
    },
    size: 120,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => {
      const c = row.original;
      const published = c.is_published;

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
              <Link
                to={`/competitions/${c.id}/settings`}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {published ? (
              <DropdownMenuItem
                onClick={() => console.log('Unpublish', c.id)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => console.log('Publish', c.id)}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log('Delete', c.id)}
              className="text-destructive flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
