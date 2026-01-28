import { useParams, useNavigate } from 'react-router-dom';
import { useQuestionBank } from '../hooks/use-question-banks';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import {
    Edit,
    FileText,
} from 'lucide-react';
import { ROUTES } from '@/config/constants';

import { format } from 'date-fns';
import { QuestionBankQuestionsList } from '../components/questions/question-bank-questions-list';


function DetailSkeleton() {
    return (
        <div className="space-y-6 px-4 py-6">
            <div className="flex justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>
            <Separator />
            <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-md" />
                    <Skeleton className="h-[200px] w-full rounded-md" />
                </div>
                <div className="w-80 space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default function QuestionBankDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: questionBank, isLoading } = useQuestionBank(id!);

    if (isLoading) {
        return <DetailSkeleton />;
    }

    if (!questionBank) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-destructive/10">
                    <FileText className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">Question Bank Not Found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    The question bank you're looking for doesn't exist or has been deleted.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.QUESTION_BANKS)} className="mt-4">
                    Back to Question Banks
                </Button>
            </div>
        );
    }

    const getGradeLabel = (grade: number) => grade === 0 ? 'UKG' : `Grade ${grade}`;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="border-b bg-background px-4 py-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight">
                                {questionBank.title}
                            </h1>
                            <Badge variant={questionBank.isActive ? 'default' : 'secondary'} className="text-xs">
                                {questionBank.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                                {questionBank.bankType.replace('_', ' ')}
                            </Badge>
                            {questionBank.status === 'draft' && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Draft
                                </Badge>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                            {questionBank.description || 'No description provided.'}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground">
                                    {getGradeLabel(questionBank.minGrade)} - {getGradeLabel(questionBank.maxGrade)}
                                </span>
                            </div>
                            <Separator orientation="vertical" className="h-3" />
                            <span>
                                Updated {format(new Date(questionBank.updatedAt), 'MMM d, yyyy')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.QUESTION_BANKS_EDIT.replace(':id', id!))}
                            className="gap-1.5"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            Edit Metadata
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(ROUTES.QUESTION_BANKS_MANAGE.replace(':id', id!))}
                            className="gap-1.5"
                        >
                            Manage Questions
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-muted/10">
                <h2 className="px-6 pt-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Questions Preview ({questionBank.questionsCount || 0})
                </h2>
                <QuestionBankQuestionsList bankId={id!} />
            </div>
        </div>
    );
}
