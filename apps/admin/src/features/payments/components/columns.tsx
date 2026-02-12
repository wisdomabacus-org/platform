
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Payment } from '../types/payment.types';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useUpdatePayment } from '../hooks/use-payments';

function currencyINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const PaymentRowActions = ({ payment }: { payment: Payment }) => {
  const { mutate: updatePayment } = useUpdatePayment();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>ID: {payment.id.substring(0, 8)}...</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(payment, null, 2))}>
          Copy JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {payment.status !== 'success' && (
          <DropdownMenuItem
            onClick={() => {
              if (confirm('Mark this payment as SUCCESS? This should only be done if you have verified the payment manually.')) {
                updatePayment({ id: payment.id, data: { status: 'success' } });
              }
            }}
          >
            Mark as Success
          </DropdownMenuItem>
        )}

        {payment.status === 'pending' && (
          <DropdownMenuItem
            onClick={() => {
              if (confirm('Mark this payment as FAILED?')) {
                updatePayment({ id: payment.id, data: { status: 'failed' } });
              }
            }}
          >
            Mark as Failed
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'Payment ID',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.substring(0, 18)}...</span>,
  },
  {
    accessorKey: 'razorpayOrderId',
    header: 'Gateway Order',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.razorpayOrderId || '—'}</span>,
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
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="font-medium">
        {currencyINR(row.original.amount)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.status;
      const failReason = row.original.failureReason;
      const v =
        s === 'success'
          ? 'default'
          : s === 'pending'
            ? 'secondary'
            : s === 'failed'
              ? 'destructive'
              : 'outline';

      return (
        <div className="flex items-center gap-2">
          <Badge variant={v as any} className="uppercase">{s}</Badge>
          {s === 'failed' && failReason && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{failReason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
    size: 110,
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => <span className="capitalize text-muted-foreground">{row.original.purpose.replace('_', ' ')}</span>
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">
        {format(row.original.createdAt, 'MMM d, yyyy HH:mm')}
      </span>
    ),
    size: 170,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => <PaymentRowActions payment={row.original} />,
  },
];
