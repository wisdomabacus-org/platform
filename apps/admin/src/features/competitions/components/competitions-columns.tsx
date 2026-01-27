
import { ColumnDef } from '@tanstack/react-table';
import { Competition } from '../types/competition.types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, FileEdit, Trash, Copy } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { DataTableColumnHeader } from '@/shared/components/data-table/data-table-column-header';

export const columns: ColumnDef<Competition>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Competition" />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue('title')}</span>
                <span className="text-xs text-muted-foreground">{row.original.slug}</span>
            </div>
        ),
    },
    {
        accessorKey: 'season',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Season" />
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            // Map statuses to colors
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
            if (status === 'published' || status === 'live' || status === 'open') {
                variant = "default"; // green-ish usually in shadcn themes if successful, logic depends on theme
            } else if (status === 'draft') {
                variant = "secondary";
            } else if (status === 'archived') {
                variant = "outline";
            }

            return <Badge variant={variant} className="capitalize">{status || 'Draft'}</Badge>;
        },
    },
    {
        accessorKey: 'exam_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Exam Date" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('exam_date') as string;
            return date ? new Date(date).toLocaleDateString() : '-';
        },
    },
    {
        accessorKey: 'enrolled_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Enrollments" />
        ),
        cell: ({ row }) => row.getValue('enrolled_count') || 0,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const competition = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link to={ROUTES.COMPETITIONS_EDIT.replace(':id', competition.id)} className="flex items-center cursor-pointer">
                                <FileEdit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(competition.id)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy ID
                        </DropdownMenuItem>
                        {/* Add more actions here */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
