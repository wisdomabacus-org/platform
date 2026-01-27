
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, MessageSquare, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { AnyRequest } from '../types/requests.types';
import { format } from 'date-fns';

export const requestColumns: ColumnDef<AnyRequest>[] = [
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const t = row.original.type;
            return (
                <div className="flex items-center gap-2">
                    {t === 'contact' ? <MessageSquare className="h-4 w-4 text-blue-500" /> : <Calendar className="h-4 w-4 text-purple-500" />}
                    <span className="capitalize">{t}</span>
                </div>
            );
        },
        size: 100,
    },
    {
        accessorKey: 'userName',
        header: 'User / Contact',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.userName}</div>
                <div className="text-xs text-muted-foreground">{row.original.userEmail}</div>
            </div>
        ),
    },
    {
        id: 'summary',
        header: 'Summary',
        cell: ({ row }) => {
            const r = row.original;
            if (r.type === 'contact') return <span className="truncate max-w-[200px] block">{r.subject}</span>;
            if (r.type === 'demo') return <span>Grade {r.grade} - {r.slot}</span>;
            return null;
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const s = row.original.status;
            return <Badge variant={s === 'resolved' ? 'default' : s === 'ignored' ? 'secondary' : 'outline'}>
                {s}
            </Badge>;
        },
        size: 100,
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => <span className="text-xs">{format(row.original.createdAt, 'MMM d, HH:mm')}</span>,
        size: 140,
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 48,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => console.log('Mark resolved', row.original.id)}>
                            Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('View full details', row.original.id)}>
                            View Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
