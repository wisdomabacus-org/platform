
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { StopCircle } from 'lucide-react';
import type { ExamSession } from '../types/exam-sessions.types';
import { formatDistanceToNow } from 'date-fns';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/components/ui/tooltip';

export const examSessionColumns: (onForceStop: (id: string) => void) => ColumnDef<ExamSession>[] = (
    onForceStop
) => [
        {
            accessorKey: 'userName',
            header: 'Student',
            cell: ({ row }) => <span className="font-medium">{row.original.userName}</span>,
        },
        {
            accessorKey: 'examTitle',
            header: 'Exam',
            cell: ({ row }) => row.original.examTitle,
        },
        {
            accessorKey: 'startTime',
            header: 'Started',
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDistanceToNow(row.original.startTime)} ago</span>,
        },
        {
            accessorKey: 'endTime',
            header: 'Ends In',
            cell: ({ row }) => {
                const now = new Date();
                const end = row.original.endTime;
                const diff = end.getTime() - now.getTime();
                const isOverdue = diff < 0;

                return (
                    <Badge variant={isOverdue ? 'destructive' : 'outline'}>
                        {isOverdue ? 'Overdue' : formatDistanceToNow(end, { addSuffix: true })}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: () => <Badge variant="secondary" className="animate-pulse">Active</Badge>,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onForceStop(row.original.id)}
                            >
                                <StopCircle className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Force Submit/Stop Session</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
    ];
