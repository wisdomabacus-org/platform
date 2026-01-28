import { useNavigate, useParams } from 'react-router-dom';
import { useQuestionBank } from '../hooks/use-question-banks';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { QuestionBankQuestions } from '../components/questions/question-bank-questions';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function QuestionBankManagePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: bank, isLoading } = useQuestionBank(id!);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-[500px] w-full" />
            </div>
        );
    }

    if (!bank) {
        return <div>Question Bank not found</div>;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <div className="px-6 py-4 border-b">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-2 -ml-2 gap-2 text-muted-foreground"
                    onClick={() => navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', id!))}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Overview
                </Button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Manage Questions</h1>
                    <p className="text-sm text-muted-foreground">
                        Add, edit, or generate questions for <span className="font-medium text-foreground">{bank.title}</span>
                    </p>
                </div>
            </div>

            {/* Content Area - Full height minus header */}
            <div className="flex-1 overflow-hidden">
                <QuestionBankQuestions bankId={id!} />
            </div>
        </div>
    );
}
