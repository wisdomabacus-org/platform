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
import type { Payment } from '../types/payment.types';

function currencyINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}
function fmtDateTime(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const dd = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const tt = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${dd} ${tt}`;
}

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => row.original.orderId,
  },
  {
    accessorKey: 'userName',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.userName}</div>
        <div className="text-xs text-muted-foreground">{row.original.userPhone}</div>
      </div>
    ),
  },
  {
    accessorKey: 'competitionTitle',
    header: 'Competition',
    cell: ({ row }) => row.original.competitionTitle,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currencyINR(row.original.amount),
    size: 100,
  },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => {
      const m = row.original.method;
      return <Badge variant="secondary">{m.charAt(0).toUpperCase() + m.slice(1)}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      const v =
        s === 'success'
          ? 'default'
          : s === 'pending'
          ? 'secondary'
          : s === 'failed'
          ? 'destructive'
          : 'outline';
      return <Badge variant={v as any}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => fmtDateTime(row.original.createdAt),
    size: 170,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => {
      const p = row.original;
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
            <DropdownMenuItem onClick={() => console.log('View transaction', p.id)}>
              View transaction
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Mark refunded', p.id)}>
              Mark refunded
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
