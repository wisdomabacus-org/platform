import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/components/ui/checkbox';
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
import type { Enrollment } from '../types/enrollment.types';

function fmtDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const enrollmentColumns: ColumnDef<Enrollment>[] = [
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
    accessorKey: 'userName',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.userName}</div>
        <div className="text-muted-foreground text-xs">{row.original.userPhone}</div>
      </div>
    ),
  },
  {
    accessorKey: 'competitionTitle',
    header: 'Competition',
    cell: ({ row }) => row.original.competitionTitle,
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
    cell: ({ row }) => row.original.grade,
    size: 60,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      const v =
        s === 'confirmed' ? 'default' : s === 'pending' ? 'secondary' : 'destructive';
      return <Badge variant={v as any}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const p = row.original.paymentStatus;
      const v =
        p === 'success'
          ? 'default'
          : p === 'pending'
            ? 'secondary'
            : p === 'failed'
              ? 'destructive'
              : 'outline';
      return <Badge variant={v as any}>{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => row.original.orderId,
  },
  {
    accessorKey: 'registeredAt',
    header: 'Registered On',
    cell: ({ row }) => fmtDate(row.original.registeredAt),
    size: 150,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => {
      const e = row.original;
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
            <DropdownMenuItem onClick={() => console.log('View', e.id)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Mark confirmed', e.id)}>
              Mark confirmed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Mark cancelled', e.id)}>
              Mark cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
