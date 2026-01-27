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

interface Props {
  initial?: Partial<MockTestFormValues>;
  onCancel: () => void;
  onSave: (values: MockTestFormValues) => void;
  isLoading?: boolean;
}

export function MockTestForm({ initial, onCancel, onSave, isLoading }: Props) {
  const form = useForm<MockTestFormValues>({
    resolver: zodResolver(mockTestSchema),
    defaultValues: {
      title: initial?.title || '',
      description: initial?.description || '',
      gradeLevel: initial?.gradeLevel || 1,
      durationMinutes: initial?.durationMinutes || 60,
      isFree: initial?.isFree || false,
      isPublished: initial?.isPublished || false,
      tags: initial?.tags || [],
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {initial ? 'Edit Mock Test' : 'Create Mock Test'}
        </h1>
        <p className="text-muted-foreground">
          Define core details. Add questions in the next step.
        </p>
      </div>

      <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-medium">Core Details</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Abacus Practice Set 01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short summary or notes." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator className="my-6" />

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Configuration</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Free mock test
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Published
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Footer spacer */}
          <div className="h-24" />

          {/* Sticky footer actions */}
          <div className="bg-background fixed right-0 bottom-0 left-0 z-10 border-t">
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 p-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save and Add Questions
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
