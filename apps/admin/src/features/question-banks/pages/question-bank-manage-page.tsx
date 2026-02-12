import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestionBank, useBulkCreateQuestions, useBulkDeleteQuestions, useQuestions } from '../hooks/use-question-banks';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { QuestionBankQuestions } from '../components/questions/question-bank-questions';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { CSVImportModal } from '../components/csv-import-modal';
import { Question } from '../types/question-bank.types';
import { toast } from 'sonner';

export default function QuestionBankManagePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: bank, isLoading } = useQuestionBank(id!);
    const { data: questions } = useQuestions(id!);
    const { mutate: bulkCreate, isPending: isImporting } = useBulkCreateQuestions();
    const { mutate: bulkDelete } = useBulkDeleteQuestions();
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

    const handleCSVImport = (importedQuestions: Partial<Question>[]) => {
        const existingIds = questions?.map((q: Question) => q.id) || [];

        if (existingIds.length > 0) {
            // Replace existing questions
            bulkDelete({ bankId: id!, questionIds: existingIds }, {
                onSuccess: () => {
                    bulkCreate({ bankId: id!, questions: importedQuestions as any }, {
                        onSuccess: () => {
                            toast.success(`Replaced with ${importedQuestions.length} imported questions`);
                            setIsCSVModalOpen(false);
                        }
                    });
                },
                onError: () => toast.error('Failed to clear existing questions'),
            });
        } else {
            bulkCreate({ bankId: id!, questions: importedQuestions as any }, {
                onSuccess: () => {
                    toast.success(`Imported ${importedQuestions.length} questions successfully`);
                    setIsCSVModalOpen(false);
                }
            });
        }
    };

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Manage Questions</h1>
                        <p className="text-sm text-muted-foreground">
                            Add, edit, or generate questions for <span className="font-medium text-foreground">{bank.title}</span>
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsCSVModalOpen(true)}
                    >
                        <Upload className="h-4 w-4" />
                        Import CSV
                    </Button>
                </div>
            </div>

            {/* Content Area - Full height minus header */}
            <div className="flex-1 overflow-hidden">
                <QuestionBankQuestions bankId={id!} />
            </div>

            {/* CSV Import Modal */}
            <CSVImportModal
                open={isCSVModalOpen}
                onOpenChange={setIsCSVModalOpen}
                onImport={handleCSVImport}
                isImporting={isImporting}
            />
        </div>
    );
}
