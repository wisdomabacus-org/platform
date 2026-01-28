import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { QuestionBankForm } from '../components/forms/question-bank-form';
import { useQuestionBank, useUpdateQuestionBank } from '../hooks/use-question-banks';
import { QuestionBankFormValues } from '../types/question-bank-schema';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { FileText } from 'lucide-react';

function EditPageSkeleton() {
    return (
        <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[180px] rounded-md" />
                    <Skeleton className="h-[120px] rounded-md" />
                    <Skeleton className="h-[160px] rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default function QuestionBankEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: questionBank, isLoading } = useQuestionBank(id!);
    const { mutate: updateQuestionBank, isPending: isUpdating } = useUpdateQuestionBank();

    if (isLoading) {
        return <EditPageSkeleton />;
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

    const handleSave = (values: QuestionBankFormValues) => {
        updateQuestionBank({ id: id!, data: values as any }, {
            onSuccess: () => {
                navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', id!));
            }
        });
    };

    return (
        <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl">
                <PageHeader
                    title="Edit Question Bank"
                    description={questionBank.title}
                />
                <div className="mt-6">
                    <QuestionBankForm
                        initial={questionBank as any}
                        onCancel={() => navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', id!))}
                        onSave={handleSave}
                        isLoading={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
}
