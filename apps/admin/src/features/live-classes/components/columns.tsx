import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { LiveClassInfo } from '../types/live-class.types';

function fmtDateTime(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const dd = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const tt = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${dd} ${tt}`;
}

export const liveClassColumns: ColumnDef<LiveClassInfo>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.title || 'Untitled'}</div>
        <div className="text-xs text-muted-foreground">{row.original.scheduleInfo}</div>
      </div>
    ),
  },
  {
    accessorKey: 'nextTopic',
    header: 'Next Topic',
    cell: ({ row }) => row.original.nextTopic || '—',
  },
  {
    accessorKey: 'nextClassAt',
    header: 'Next Class',
    cell: ({ row }) => fmtDateTime(row.original.nextClassAt),
    size: 160,
  },
  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-1">
        {(row.original.tags || []).map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Active' : 'Hidden'}
      </Badge>
    ),
    size: 110,
  },
  {
    id: 'quick',
    header: 'Links',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <a href={row.original.meetLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
          Meet <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
        </a>
        <span className="text-muted-foreground">·</span>
        <a href={row.original.materialLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
          Material <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
        </a>
      </div>
    ),
    size: 200,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => {
      const lc = row.original;
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
            <DropdownMenuItem onClick={() => console.log('Edit', lc.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Toggle Active', lc.id)}>
              {lc.isActive ? 'Hide' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Delete', lc.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
