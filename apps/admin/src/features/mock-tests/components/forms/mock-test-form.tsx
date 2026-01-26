import { useState } from 'react';
import { Separator } from '@/shared/components/ui/separator';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';

type FormValues = {
  title: string;
  description?: string;
  gradeLevel: number | '';
  isFree: boolean;
  durationMinutes: number | '';
  isPublished: boolean;
};

interface Props {
  initial?: Partial<FormValues>;
  onCancel: () => void;
  onSave: (values: FormValues) => void; // UI-only for now
}

export function MockTestForm({ initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<FormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    gradeLevel: initial?.gradeLevel ?? '',
    isFree: initial?.isFree ?? false,
    durationMinutes: initial?.durationMinutes ?? '',
    isPublished: initial?.isPublished ?? false,
  });

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) return; // basic guard
    if (!form.gradeLevel || !form.durationMinutes) return;
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      gradeLevel: Number(form.gradeLevel),
      durationMinutes: Number(form.durationMinutes),
    });
  };

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

      {/* Core Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Core Details</h3>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Abacus Practice Set 01"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description (optional)</Label>
          <Textarea
            id="desc"
            placeholder="Short summary or notes."
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </section>

      <Separator className="my-6" />

      {/* Configuration */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Configuration</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade</Label>
            <Input
              id="gradeLevel"
              type="number"
              inputMode="numeric"
              placeholder="1 to 12"
              value={form.gradeLevel}
              onChange={(e) =>
                update('gradeLevel', e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              inputMode="numeric"
              placeholder="30"
              value={form.durationMinutes}
              onChange={(e) =>
                update('durationMinutes', e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFree"
              checked={form.isFree}
              onCheckedChange={(v) => update('isFree', !!v)}
            />
            <Label htmlFor="isFree">Free mock test</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublished"
              checked={form.isPublished}
              onCheckedChange={(v) => update('isPublished', !!v)}
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-24" />

      {/* Sticky footer actions */}
      <div className="bg-background fixed right-0 bottom-0 left-0 z-10 border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 p-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save and Add Questions</Button>
        </div>
      </div>
    </div>
  );
}
