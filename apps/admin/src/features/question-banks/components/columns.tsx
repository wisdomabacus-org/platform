import { ColumnDef } from '@tanstack/react-table';
import { QuestionBank } from '../types/question-bank.types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Edit, Trash, Eye, Copy } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { useDeleteQuestionBank } from '../hooks/use-question-banks';

function ActionCell({ row }: { row: QuestionBank }) {
    const navigate = useNavigate();
    const { mutate: deleteBank } = useDeleteQuestionBank();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', row.id))}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Questions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.QUESTION_BANKS_EDIT.replace(':id', row.id))}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        if (confirm('Are you sure? This action cannot be undone.')) {
                            deleteBank(row.id);
                        }
                    }}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const getGradeLabel = (grade: number) => grade === 0 ? 'UKG' : `G${grade}`;

export const columns: ColumnDef<QuestionBank>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const type = row.original.bankType;
            return (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{row.getValue('title')}</span>
                        {type === 'mock_test' && (
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                                Mock
                            </Badge>
                        )}
                    </div>
                    {row.original.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                            {row.original.description}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'minGrade',
        header: 'Grade Range',
        cell: ({ row }) => {
            const min = row.original.minGrade;
            const max = row.original.maxGrade;
            return (
                <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="font-normal">
                        {getGradeLabel(min)} - {getGradeLabel(max)}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: 'questionsCount',
        header: 'Questions',
        cell: ({ row }) => {
            const count = row.getValue('questionsCount') as number;
            return (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{count > 0 ? count : '—'}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = row.original.isActive;

            return (
                <div className="flex items-center gap-2">
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={!isActive ? 'opacity-50' : ''}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {status === 'draft' && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                            Draft
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground">
                {format(new Date(row.original.updatedAt), 'MMM d, yyyy')}
            </span>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell row={row.original} />,
    },
];
