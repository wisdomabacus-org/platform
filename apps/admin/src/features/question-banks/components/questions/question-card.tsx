import { Question } from '../../types/question-bank.types';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    question: Question;
    index: number;
    onDelete?: (id: string) => void;
    onEdit?: (question: Question) => void;
}

export function QuestionCard({ question, index, onDelete }: Props) {


    return (
        <Card className="group relative flex flex-col overflow-hidden border-muted transition-all hover:border-primary/20 hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2 transition-colors group-hover:bg-muted/30">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-5 min-w-6 justify-center px-1 text-[10px] font-medium text-muted-foreground bg-background">
                        #{index + 1}
                    </Badge>
                    <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">
                        {question.operatorType}
                    </span>
                </div>
                {onDelete && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDelete(question.id)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        <GripVertical className="h-3 w-3 text-muted-foreground/30 cursor-grab" />
                    </div>
                )}
            </div>

            {/* Content: Operation Display */}
            <div className="flex flex-1 flex-col items-center justify-center p-5 min-h-[140px]">
                <div className={cn(
                    "flex flex-col items-end font-mono font-bold tracking-widest text-foreground text-xl",
                )}>
                    {question.operations.map((num, idx) => {
                        const isLast = idx === question.operations.length - 1;
                        let operatorSymbol = '';

                        // Determine prefix symbol for the last row in specific cases
                        if (isLast) {
                            if (question.operatorType === 'multiplication') operatorSymbol = '×';
                            else if (question.operatorType === 'division') operatorSymbol = '÷';
                            // For Mixed/Add/Sub, we usually rely on signs, but could add '+' if strictly positive and not first?
                            // Abacus usually just shows signed numbers.
                        }

                        // For Abacus (Add/Sub), negative numbers have '-'
                        const isNegative = num < 0;
                        const val = Math.abs(num);

                        return (
                            <div key={idx} className="relative flex items-center justify-end w-full gap-2">
                                {/* Operator for Math Ops (Multiplication/Division) on last row */}
                                {operatorSymbol && (
                                    <span className="absolute -left-6 text-muted-foreground font-normal">{operatorSymbol}</span>
                                )}

                                {/* Sign for Abacus/Mixed operations */}
                                {!operatorSymbol && isNegative && (
                                    <span className="absolute -left-4 text-muted-foreground font-normal">-</span>
                                )}

                                <span>{val}</span>
                            </div>
                        );
                    })}

                    {/* Divider & Answer */}
                    <div className="mt-2 w-full border-t-2 border-primary/20" />
                    <div className="mt-1 text-emerald-600 dark:text-emerald-400">
                        {question.correctAnswer}
                    </div>
                </div>
            </div>

            {/* Footer: Options Preview */}
            <div className="border-t bg-muted/5 px-3 py-2">
                <div className="grid grid-cols-4 gap-1">
                    {question.options.map((opt, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex h-6 items-center justify-center rounded text-[10px] font-medium transition-colors",
                                idx === question.correctOptionIndex
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/20"
                                    : "bg-muted text-muted-foreground"
                            )}
                            title={opt.text}
                        >
                            {opt.text}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
