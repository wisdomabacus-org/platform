
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { questionSchema, QuestionFormValues } from '../../types/question-schema';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { DialogFooter } from '@/shared/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';

interface Props {
    initial?: Partial<QuestionFormValues>;
    onCancel: () => void;
    onSave: (values: QuestionFormValues) => void;
    isLoading?: boolean;
}

export function QuestionForm({ initial, onCancel, onSave, isLoading }: Props) {
    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            text: initial?.text || '',
            imageUrl: initial?.imageUrl || '',
            marks: initial?.marks || 1,
            options: initial?.options || [
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
            ],
            correctOptionIndex: initial?.correctOptionIndex ?? 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'options',
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                                <Textarea placeholder="What is 2 + 2?" rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="marks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marks</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    className="w-24"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Options (Tick the correct answer)</FormLabel>
                        {fields.length < 6 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ text: '' })}
                            >
                                <Plus className="mr-2 h-3 w-3" /> Add Option
                            </Button>
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="correctOptionIndex"
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value.toString()}
                                onValueChange={(val) => field.onChange(Number(val))}
                                className="space-y-3"
                            >
                                {fields.map((fieldItem, index) => (
                                    <div key={fieldItem.id} className="flex items-center gap-3">
                                        <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.text`}
                                            render={({ field: optField }) => (
                                                <div className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder={`Option ${index + 1}`} {...optField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                        {fields.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                    />
                    <FormMessage>
                        {form.formState.errors.correctOptionIndex?.message}
                    </FormMessage>
                </div>

                <DialogFooter>
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Question
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
