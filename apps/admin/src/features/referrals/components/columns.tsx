
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Copy } from 'lucide-react';
import type { Referrer } from '../types/referrals.types';
import { toast } from 'sonner';

export const referrerColumns: ColumnDef<Referrer>[] = [
    {
        accessorKey: 'name',
        header: 'Referrer Name',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                {row.original.email && <span className="text-xs text-muted-foreground">{row.original.email}</span>}
            </div>
        ),
    },
    {
        accessorKey: 'code',
        header: 'Referral Code',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{row.original.code}</code>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                        navigator.clipboard.writeText(row.original.code);
                        toast.success('Code copied');
                    }}
                >
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        ),
    },
    {
        accessorKey: 'totalReferrals',
        header: 'Total Referrals',
        cell: ({ row }) => <span className="font-bold">{row.original.totalReferrals}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>{row.original.status}</Badge>,
    },
];
