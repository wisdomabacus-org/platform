
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { QuestionBankForm } from './forms/question-bank-form';
import { useCreateQuestionBank } from '../hooks/use-question-banks';
import { QuestionBankFormValues } from '../types/question-bank-schema';

export function QuestionBanksHeader() {
    const [open, setOpen] = useState(false);
    const { mutate: createBank, isPending } = useCreateQuestionBank();

    const handleSave = (values: QuestionBankFormValues) => {
        createBank(values, {
            onSuccess: () => setOpen(false)
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Question Banks</h2>
                <p className="text-muted-foreground">
                    Manage your question collections.
                </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Bank
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Question Bank</DialogTitle>
                    </DialogHeader>
                    <QuestionBankForm
                        onCancel={() => setOpen(false)}
                        onSave={handleSave}
                        isLoading={isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
