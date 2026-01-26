import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { CompetitionResultsRow } from '../types/results.types';
import { Link } from 'react-router-dom';

function fmtDate(d?: Date | string) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export const resultsColumns: ColumnDef<CompetitionResultsRow>[] = [
  {
    accessorKey: 'competitionTitle',
    header: 'Competition',
    cell: ({ row }) => (
      <Link to={`/results/:id`} className="font-medium hover:underline">
        {row.original.competitionTitle}
      </Link>
    ),
  },
  {
    accessorKey: 'grades',
    header: 'Grades',
    cell: ({ row }) => (row.original.grades || []).join(', '),
    size: 120,
  },
  {
    accessorKey: 'totalParticipants',
    header: 'Participants',
    cell: ({ row }) => row.original.totalParticipants,
    size: 120,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      const v = s === 'published' ? 'default' : 'secondary';
      return <Badge variant={v as any}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published On',
    cell: ({ row }) => fmtDate(row.original.publishedAt),
    size: 160,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => {
      const r = row.original;
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
              <Link to={`/competitions/${r.competitionId}/results`}>Open results</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {r.status === 'pending' ? (
              <DropdownMenuItem onClick={() => console.log('Publish', r.competitionId)}>
                Publish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => console.log('Unpublish', r.competitionId)}>
                Unpublish
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => console.log('Export CSV', r.competitionId)}>
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
