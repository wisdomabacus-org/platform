import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { questionBankSchema, QuestionBankFormValues } from '../../types/question-bank-schema';
import { Loader2, FileText, Save, Target, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { GRADE_OPTIONS } from '../../types/question-bank.types';

interface Props {
    initial?: Partial<QuestionBankFormValues>;
    onCancel: () => void;
    onSave: (values: QuestionBankFormValues) => void;
    isLoading?: boolean;
}

export function QuestionBankForm({ initial, onCancel, onSave, isLoading }: Props) {
    const form = useForm<QuestionBankFormValues>({
        resolver: zodResolver(questionBankSchema) as any,
        defaultValues: {
            title: initial?.title || '',
            description: initial?.description || '',
            minGrade: initial?.minGrade || 0,
            maxGrade: initial?.maxGrade || 8,
            bankType: initial?.bankType || 'competition',
            status: initial?.status || 'draft',
            isActive: initial?.isActive ?? true,
            tags: initial?.tags || [],
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave as any)} className="space-y-6">

                {/* 1. Identity & Scope */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Bank Details</h3>
                                <p className="text-xs text-muted-foreground">Core identification info</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control as any}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium uppercase text-muted-foreground">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Level 1 Mixed Operations" className="bg-muted/30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium uppercase text-muted-foreground">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the difficulty and purpose..."
                                                rows={3}
                                                className="resize-none bg-muted/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Target Context */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Target className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Context</h3>
                                    <p className="text-xs text-muted-foreground">Where this bank applies</p>
                                </div>
                            </div>

                            <FormField
                                control={form.control as any}
                                name="bankType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium uppercase text-muted-foreground">Usage Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-muted/30">
                                                    <SelectValue placeholder="Select usage context" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="competition">Competition</SelectItem>
                                                <SelectItem value="mock_test">Mock Test</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Grade Range */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                    <BookOpen className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Grade Range</h3>
                                    <p className="text-xs text-muted-foreground">Applicable student levels</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="minGrade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium uppercase text-muted-foreground">From Grade</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val))}
                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-muted/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {GRADE_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value.toString()}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control as any}
                                    name="maxGrade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium uppercase text-muted-foreground">To Grade</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val))}
                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-muted/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {GRADE_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value.toString()}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="rounded-xl border bg-muted/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FormField
                            control={form.control as any}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormLabel className="text-sm font-medium">Status:</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 w-32 bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <div className="h-4 w-px bg-border" />
                        <FormField
                            control={form.control as any}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormLabel className="text-sm font-medium">Active:</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {initial ? 'Save Changes' : 'Create Bank'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
