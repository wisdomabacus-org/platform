import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { mockTestSchema, MockTestFormValues } from '../../types/mock-test-schema';
import { Loader2, FileText, Clock, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave as any)} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-md border p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <p className="text-xs text-muted-foreground">Title and description</p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Abacus Level 1 Practice Test" className="h-9" {...field} />
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
                  <FormLabel className="text-xs font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this mock test covers..."
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control as any}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Difficulty *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
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
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-9"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="rounded-md border p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Test Configuration</h3>
              <p className="text-xs text-muted-foreground">Duration, questions, and grade range</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control as any}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Duration (mins) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-9"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="total_questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Total Questions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-9"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
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
                  <FormLabel className="text-xs font-medium">Min Grade *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      className="h-9"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
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
                  <FormLabel className="text-xs font-medium">Max Grade *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      className="h-9"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 12)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Settings & Visibility */}
        <div className="rounded-md border p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10">
              <Settings className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Settings & Visibility</h3>
              <p className="text-xs text-muted-foreground">Access control and status</p>
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control as any}
              name="is_locked"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Paid Content</FormLabel>
                    <p className="text-xs text-muted-foreground">Requires enrollment or purchase to access</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Published</FormLabel>
                    <p className="text-xs text-muted-foreground">Visible to users on the platform</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Active</FormLabel>
                    <p className="text-xs text-muted-foreground">Allow new attempts on this test</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onCancel} className="h-9">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="h-9 gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? 'Update Mock Test' : 'Create Mock Test'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
