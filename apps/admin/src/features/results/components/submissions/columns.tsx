
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Submission } from '../../types/results.types';
import { format } from 'date-fns';

function formatDuration(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
}

export const submissionColumns: ColumnDef<Submission>[] = [
    {
        accessorKey: 'userName',
        header: 'User',
        cell: ({ row }) => <span className="font-medium">{row.original.userName}</span>,
    },
    {
        accessorKey: 'examTitle',
        header: 'Exam',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span>{row.original.examTitle}</span>
                <span className="text-xs text-muted-foreground capitalize">{row.original.examType?.replace('_', ' ')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'score',
        header: 'Score',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-bold">{row.original.score}</span>
                <span className="text-xs text-muted-foreground">/ {row.original.totalQuestions}</span>
            </div>
        ),
    },
    {
        accessorKey: 'timeTaken',
        header: 'Time',
        cell: ({ row }) => <span className="font-mono text-xs">{formatDuration(row.original.timeTaken)}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const s = row.original.status;
            return <Badge variant={s === 'submitted' ? 'default' : 'secondary'} className="uppercase">
                {s}
            </Badge>;
        },
        size: 100,
    },
    {
        accessorKey: 'submittedAt',
        header: 'Submitted',
        cell: ({ row }) => <span className="text-xs">{format(row.original.submittedAt, 'MMM d, HH:mm')}</span>,
        size: 140,
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 48,
        cell: ({ row }) => {
            const s = row.original;
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
                        <DropdownMenuItem onClick={() => console.log('View submission', s.id)}>
                            View Breakdown
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
