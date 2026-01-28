import { useState } from 'react';
import { useQuestions, useBulkCreateQuestions, useDeleteQuestion, useCreateQuestion } from '../../hooks/use-question-banks';
import { QuestionCard } from './question-card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Loader2, Wand2, Plus } from 'lucide-react';
import { generateBatchQuestions } from '../../utils/question-generator';
import { OperatorType, Question } from '../../types/question-bank.types';
import { toast } from 'sonner';
import { Separator } from '@/shared/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { ManualQuestionForm } from '../forms/manual-question-form';

export function QuestionBankQuestions({ bankId }: { bankId: string }) {
    const { data: questions, isLoading } = useQuestions(bankId);
    const { mutate: bulkCreate, isPending: isGenerating } = useBulkCreateQuestions();
    const { mutate: createQuestion } = useCreateQuestion();
    const { mutate: deleteQuestion } = useDeleteQuestion();

    const [isManualOpen, setIsManualOpen] = useState(false);

    // Generation State
    const [genConfig, setGenConfig] = useState({
        count: 10,
        digits: 1,
        rows: 3,
        operator: 'mixed' as OperatorType,
        allowNegative: false,
    });

    const handleGenerate = () => {
        const generated = generateBatchQuestions({
            count: genConfig.count || 10,
            digits: genConfig.digits,
            rows: genConfig.rows || 3,
            operators: genConfig.operator === 'mixed' ? ['addition', 'subtraction'] : [genConfig.operator],
            allowNegative: genConfig.allowNegative,
        });

        bulkCreate({ bankId, questions: generated as any }, {
            onSuccess: () => {
                toast.success(`Generated ${generated.length} questions successfully`);
            }
        });
    };

    const handleManualSave = (question: Partial<Question>) => {
        createQuestion({ bankId, ...question } as any, {
            onSuccess: () => {
                toast.success('Question added successfully');
                setIsManualOpen(false);
            }
        });
    };

    // Helper for number inputs to allow clearing
    const handleNumInput = (val: string, field: 'count' | 'rows') => {
        if (val === '') {
            // We need to cast to any or allow undefined to handle empty state temporarily, 
            // but simpler is to just keep it as 0 or handle it in UI value.
            // Actually, let's just cheat and store it in state as string or number? 
            // Ideally we refactor state to allow partial.
            // For now, let's just parse. If NaN, default to 0 (which renders as 0).
            // To allow empty, we'd need a separate string state or allow null.
            // Let's rely on standard forgiving parse:
            setGenConfig({ ...genConfig, [field]: 0 });
        } else {
            const parsed = parseInt(val);
            if (!isNaN(parsed)) setGenConfig({ ...genConfig, [field]: parsed });
        }
    };

    return (
        <div className="flex h-full">
            {/* Main Content: Questions Grid */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : questions?.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                        <Wand2 className="mb-4 h-12 w-12 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No Questions Yet</h3>
                        <p className="max-w-xs text-center text-sm">
                            Use the panel on the right to generate questions or add them manually.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
                        {questions?.map((q: Question, idx: number) => (
                            <QuestionCard
                                key={q.id}
                                index={idx}
                                question={q}
                                onDelete={(id) => {
                                    if (confirm('Delete this question?')) deleteQuestion(id);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar: Configuration */}
            <div className="w-80 border-l bg-background p-4 flex flex-col gap-4">
                <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="generate">Generate</TabsTrigger>
                        <TabsTrigger value="manual">Manual</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-6 pt-4 h-[calc(100vh-12rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Number of Questions</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={genConfig.count || ''}
                                    onChange={e => handleNumInput(e.target.value, 'count')}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Operation</Label>
                                <Select
                                    value={genConfig.operator}
                                    onValueChange={(v: OperatorType) => setGenConfig({ ...genConfig, operator: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="addition">Addition Only</SelectItem>
                                        <SelectItem value="subtraction">Subtraction Only</SelectItem>
                                        <SelectItem value="mixed">Mixed (+ / -)</SelectItem>
                                        <SelectItem value="multiplication">Multiplication</SelectItem>
                                        <SelectItem value="division">Division</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {['addition', 'subtraction', 'mixed'].includes(genConfig.operator) && (
                                <div className="space-y-2">
                                    <Label>Rows (Operands)</Label>
                                    <Input
                                        type="number"
                                        min={2}
                                        max={15}
                                        value={genConfig.rows || ''}
                                        onChange={e => handleNumInput(e.target.value, 'rows')}
                                    />
                                    <p className="text-[10px] text-muted-foreground">How many numbers to calculate</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Digits</Label>
                                <Select
                                    value={genConfig.digits.toString()}
                                    onValueChange={(v) => setGenConfig({ ...genConfig, digits: parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Digit (0-9)</SelectItem>
                                        <SelectItem value="2">2 Digits (10-99)</SelectItem>
                                        <SelectItem value="3">3 Digits (100-999)</SelectItem>
                                        <SelectItem value="4">4 Digits (1000-9999)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Advanced Settings */}
                            {genConfig.operator === 'mixed' && (
                                <div className="flex items-center justify-between space-y-0 rounded-md border p-3">
                                    <Label className="text-sm font-normal">Allow Negatives</Label>
                                    <Switch
                                        checked={genConfig.allowNegative}
                                        onCheckedChange={c => setGenConfig({ ...genConfig, allowNegative: c })}
                                    />
                                </div>
                            )}

                            <Button
                                className="w-full gap-2"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                Generate Questions
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="manual" className="pt-4 text-center">
                        <div className="rounded-md border border-dashed p-8">
                            <p className="text-sm text-muted-foreground">
                                Complete control over numbers and answer.
                            </p>

                            <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" /> Add One
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Manual Question</DialogTitle>
                                    </DialogHeader>
                                    <ManualQuestionForm
                                        onSave={handleManualSave}
                                        onCancel={() => setIsManualOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
