
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/shared/components/ui/separator';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { mockTestSchema, MockTestFormValues } from '../../types/mock-test-schema';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface Props {
  initial?: Partial<MockTestFormValues>;
  onCancel: () => void;
  onSave: (values: MockTestFormValues) => void;
  isLoading?: boolean;
}

export function MockTestForm({ initial, onCancel, onSave, isLoading }: Props) {
  const form = useForm<MockTestFormValues>({
    resolver: zodResolver(mockTestSchema) as any,
    defaultValues: {
      title: initial?.title || '',
      description: initial?.description || '',
      difficulty: initial?.difficulty || 'Beginner',
      duration: initial?.duration || 60,
      total_questions: initial?.total_questions || 0,
      min_grade: initial?.min_grade || 1,
      max_grade: initial?.max_grade || 12,
      is_active: initial?.is_active ?? true,
      is_published: initial?.is_published ?? false,
      is_locked: initial?.is_locked ?? false,
      tags: initial?.tags || [],
      sort_order: initial?.sort_order || 0,
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {initial ? 'Edit Mock Test' : 'Create Mock Test'}
        </h1>
        <p className="text-muted-foreground">
          Define core details for this mock test.
        </p>
      </div>

      <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave as any)} className="space-y-8">
          <section className="space-y-6">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Abacus Level 1 Final Practice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details about this mock test..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="min_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Grade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={12} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="max_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Grade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={12} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <h3 className="text-lg font-medium">Settings & Visibility</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control as any}
                name="is_locked"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Paid (Locked)</FormLabel>
                      <FormDescription>Requires enrollment or purchase</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>Visible to users</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>Allow new attempts</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </section>

          <div className="flex justify-end gap-4 p-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initial ? 'Update Mock Test' : 'Create Mock Test'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
