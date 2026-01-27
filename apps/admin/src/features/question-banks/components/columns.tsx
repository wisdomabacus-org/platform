
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
import type { QuestionBank } from '../types/question-bank.types';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/shared/components/ui/checkbox';

export const questionBankColumns: ColumnDef<QuestionBank>[] = [
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
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <Link
                to={`/question-banks/${row.original.id}`} // maybe edit or detail
                className="font-medium hover:underline"
            >
                {row.original.title}
            </Link>
        ),
    },
    {
        header: 'Grade Range',
        accessorFn: (row) => `${row.minGrade} - ${row.maxGrade}`,
        size: 100,
    },
    {
        accessorKey: 'questionsCount',
        header: 'Questions',
        size: 100,
    },
    {
        accessorKey: 'usageCount',
        header: 'Usage',
        size: 80,
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
                {row.original.isActive ? 'Active' : 'Archived'}
            </Badge>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        size: 120,
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
    },
    {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => {
            const qb = row.original;
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
                        <DropdownMenuItem asChild>
                            <Link to={`/question-banks/${qb.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={`/question-banks/${qb.id}/questions`}>Manage Questions</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
