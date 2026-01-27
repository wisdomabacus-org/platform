
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions, useQuestionBank, useCreateQuestion, useUpdateQuestion, useDeleteQuestion, useBulkCreateQuestions } from '../hooks/use-question-banks';
import { QuestionCard } from '../components/questions/question-card';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2, Plus, Upload } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { QuestionForm } from '../components/questions/question-form';
import { Question } from '../types/question-bank.types';
import { QuestionFormValues } from '../types/question-schema';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { BulkImportModal } from '../components/questions/bulk-import-modal';

export default function QuestionBanksQuestionsPage() {
    const { id: bankId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: bank, isLoading: isBankLoading } = useQuestionBank(bankId!);
    const { data: questions, isLoading: isQuestionsLoading } = useQuestions(bankId!);

    const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
    const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();
    const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
    const { mutate: bulkCreateQuestions, isPending: isImporting } = useBulkCreateQuestions();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const isLoading = isBankLoading || isQuestionsLoading;

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (!bank) return <div>Question Bank not found</div>;

    const handleCreate = (values: QuestionFormValues) => {
        createQuestion({ bankId: bankId!, data: values }, {
            onSuccess: () => setIsFormOpen(false)
        });
    };

    const handleUpdate = (values: QuestionFormValues) => {
        if (!editingQuestion) return;
        updateQuestion({ id: editingQuestion.id, data: values }, {
            onSuccess: () => {
                setIsFormOpen(false);
                setEditingQuestion(null);
            }
        });
    };

    const handleDelete = () => {
        if (!deletingId) return;
        deleteQuestion(deletingId, {
            onSuccess: () => setDeletingId(null)
        });
    };

    const handleImport = (data: any[]) => {
        bulkCreateQuestions({ bankId: bankId!, questions: data }, {
            onSuccess: () => setIsImportOpen(false)
        });
    };

    const openCreate = () => {
        setEditingQuestion(null);
        setIsFormOpen(true);
    };

    const openEdit = (q: Question) => {
        setEditingQuestion(q);
        setIsFormOpen(true);
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-8 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.QUESTION_BANKS)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">{bank.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            {questions?.length || 0} Questions • Grade {bank.minGrade}-{bank.maxGrade}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import CSV
                    </Button>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 dark:bg-slate-950/50">
                {questions && questions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {questions.map((q, i) => (
                            <QuestionCard
                                key={q.id}
                                question={q}
                                index={i}
                                onEdit={openEdit}
                                onDelete={setDeletingId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800 mb-4">
                            <Plus className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium">No questions yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Start adding questions to this bank manually or import them from a file.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                                Import CSV
                            </Button>
                            <Button onClick={openCreate}>
                                Add First Question
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={(v) => !v && setIsFormOpen(false)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
                    </DialogHeader>
                    <QuestionForm
                        initial={editingQuestion ? {
                            text: editingQuestion.text,
                            imageUrl: editingQuestion.imageUrl,
                            marks: editingQuestion.marks,
                            options: editingQuestion.options,
                            correctOptionIndex: editingQuestion.correctOptionIndex
                        } : undefined}
                        onCancel={() => setIsFormOpen(false)}
                        onSave={editingQuestion ? handleUpdate : handleCreate}
                        isLoading={isCreating || isUpdating}
                    />
                </DialogContent>
            </Dialog>

            <BulkImportModal
                open={isImportOpen}
                onOpenChange={setIsImportOpen}
                onImport={handleImport}
                isLoading={isImporting}
            />

            {/* Delete Alert */}
            <AlertDialog open={!!deletingId} onOpenChange={(v) => !v && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the question.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
