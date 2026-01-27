
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
import { format } from 'date-fns';

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
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.competitionTitle}</span>
        <span className="text-xs text-muted-foreground">{row.original.competitionSeason}</span>
      </div>
    ),
  },
  {
    accessorKey: 'paymentId',
    header: 'Payment ID',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.paymentId}</span>,
  },
  {
    accessorKey: 'isPaymentConfirmed',
    header: 'Payment',
    cell: ({ row }) => (
      <Badge variant={row.original.isPaymentConfirmed ? 'default' : 'secondary'}>
        {row.original.isPaymentConfirmed ? 'Paid' : 'Unpaid'}
      </Badge>
    ),
    size: 110,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      return <Badge variant="outline" className="uppercase">{s}</Badge>;
    },
    size: 110,
  },
  {
    accessorKey: 'submissionId',
    header: 'Exam',
    cell: ({ row }) => (
      row.original.submissionId ? <Badge variant="secondary">Submitted</Badge> : <span className="text-muted-foreground">Pending</span>
    ),
  },
  {
    accessorKey: 'registeredAt',
    header: 'Registered On',
    cell: ({ row }) => <span className="text-xs">{format(row.original.registeredAt, 'PP')}</span>,
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
            <DropdownMenuItem onClick={() => console.log('View enrollment', e.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Cancel Enrollment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
