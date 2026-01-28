import { useQuestions } from '../../hooks/use-question-banks';
import { QuestionCard } from './question-card';
import { Loader2, FileText } from 'lucide-react';
import { Question } from '../../types/question-bank.types';

export function QuestionBankQuestionsList({ bankId }: { bankId: string }) {
    const { data: questions, isLoading } = useQuestions(bankId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText className="h-10 w-10 opacity-20 mb-3" />
                <p>No questions added yet.</p>
            </div>
        );
    }

    return (
        <div className="p-4 overflow-y-auto h-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
                {questions.map((q: Question, idx: number) => (
                    <QuestionCard
                        key={q.id}
                        index={idx}
                        question={q}
                    // readonly - no onDelete prop
                    />
                ))}
            </div>
        </div>
    );
}
