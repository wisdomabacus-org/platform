
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Question } from '../../types/question-bank.types';

interface Props {
    question: Question;
    index: number;
    onEdit: (q: Question) => void;
    onDelete: (id: string) => void;
}

export function QuestionCard({ question, index, onEdit, onDelete }: Props) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0">
                        {index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                        {question.marks} Marks
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(question)}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(question.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-2">
                <div className="prose prose-sm max-w-none text-sm dark:prose-invert">
                    <p className="whitespace-pre-wrap">{question.text}</p>
                </div>

                {question.imageUrl && (
                    <img src={question.imageUrl} alt="Question" className="rounded-md max-h-40 object-contain bg-slate-50 dark:bg-slate-900 w-full" />
                )}

                <div className="space-y-2">
                    {question.options.map((opt, i) => (
                        <div
                            key={opt.id || i}
                            className={`flex items-center rounded-md border px-3 py-2 text-sm ${i === question.correctOptionIndex
                                ? 'border-green-500 bg-green-50 dark:border-green-900 dark:bg-green-900/10'
                                : 'border-transparent bg-muted'
                                }`}
                        >
                            <span className="mr-3 font-mono text-xs text-muted-foreground">
                                {String.fromCharCode(65 + i)}.
                            </span>
                            <span className={i === question.correctOptionIndex ? 'font-medium text-green-700 dark:text-green-300' : ''}>
                                {opt.text}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
