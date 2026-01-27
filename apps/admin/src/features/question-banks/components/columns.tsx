import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Settings, HelpCircle, Trash2 } from 'lucide-react';
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
import { useUpdateQuestionBank, useDeleteQuestionBank } from '../hooks/use-question-banks';

import { QuestionBankForm } from './forms/question-bank-form';
import { QuestionBankFormValues } from '../types/question-bank-schema';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

const QuestionBankRowActions = ({ qb }: { qb: QuestionBank }) => {
    const [editOpen, setEditOpen] = useState(false);
    const { mutate: updateBank, isPending: isUpdating } = useUpdateQuestionBank();
    const { mutate: deleteBank } = useDeleteQuestionBank();

    const handleUpdate = (values: QuestionBankFormValues) => {
        updateBank(
            {
                id: qb.id, data: {
                    title: values.title,
                    description: values.description,
                    min_grade: values.minGrade,
                    max_grade: values.maxGrade,
                    is_active: values.isActive,
                    tags: values.tags
                }
            },
            { onSuccess: () => setEditOpen(false) }
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setEditOpen(true)} className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" /> Edit Bank
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to={`/question-banks/${qb.id}/questions`} className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" /> Manage Questions
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => updateBank({ id: qb.id, data: { is_active: !qb.isActive } })}
                        className="flex items-center gap-2"
                    >
                        {qb.isActive ? 'Archive' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this question bank? This will delete all questions within it.')) {
                                deleteBank(qb.id);
                            }
                        }}
                        className="text-destructive flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Question Bank</DialogTitle>
                    </DialogHeader>
                    <QuestionBankForm
                        initial={{
                            title: qb.title,
                            description: qb.description || '',
                            minGrade: qb.minGrade,
                            maxGrade: qb.maxGrade,
                            isActive: qb.isActive,
                            tags: qb.tags || [],
                        }}
                        onCancel={() => setEditOpen(false)}
                        onSave={handleUpdate}
                        isLoading={isUpdating}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export const questionBankColumns: ColumnDef<QuestionBank>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue('title')}</span>
                <span className="text-muted-foreground text-xs line-clamp-1">{row.original.description}</span>
            </div>
        ),
    },
    {
        id: 'grade',
        header: 'Grade Range',
        cell: ({ row }) => (
            <span className="text-sm font-medium">
                {row.original.minGrade} - {row.original.maxGrade}
            </span>
        )
    },
    {
        accessorKey: 'questionsCount',
        header: 'Questions',
        cell: ({ row }) => (
            <span className="text-sm font-mono">{row.getValue('questionsCount')}</span>
        )
    },
    {
        accessorKey: 'usageCount',
        header: 'Usage',
        cell: ({ row }) => (
            <span className="text-sm">{row.getValue('usageCount')}</span>
        )
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
                {row.getValue('isActive') ? 'Active' : 'Archived'}
            </Badge>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return (
                <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString()}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 48,
        cell: ({ row }) => <QuestionBankRowActions qb={row.original} />,
    },
];
