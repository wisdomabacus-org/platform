import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/shared/components/ui/separator';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/config/constants';

type FormState = {
  title: string;
  description: string;
  prizeDetails: string;
  enrollmentFee: string; // keep as string for UI
  durationMinutes: string;
  applicableGrades: number[];
  registrationStart: string; // ISO date-time or date string for now
  registrationEnd: string;
  competitionDate: string; // date
  examStartTime: string; // HH:mm
  examEndTime: string; // HH:mm
  resultsAnnouncement: string; // date-time
};

export default function CreateCompetitionPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    prizeDetails: '',
    enrollmentFee: '',
    durationMinutes: '',
    applicableGrades: [],
    registrationStart: '',
    registrationEnd: '',
    competitionDate: '',
    examStartTime: '',
    examEndTime: '',
    resultsAnnouncement: '',
  });

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleGrade = (g: number) =>
    setForm((f) => {
      const s = new Set(f.applicableGrades);
      if (s.has(g)) s.delete(g);
      else s.add(g);
      return { ...f, applicableGrades: Array.from(s).sort((a, b) => a - b) };
    });

  const onCancel = () => navigate(ROUTES.COMPETITIONS);

  const onSave = () => {
    // Later: validate -> POST -> toast -> navigate(`/competitions/${id}/questions`)
    // For now: simulate success and move to mock questions route with temp id
    const mockId = 'tmp-1';
    navigate(`/competitions/${mockId}/questions`);
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto ">
      <div className="mx-auto max-w-2xl p-6 bg-stone-100 px-20">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create New Competition
          </h1>
          <p className="text-muted-foreground">
            Fill in the details for your new competition. You will add questions in the
            next step.
          </p>
        </div>

        <Separator className="my-6" />

        {/* Core Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Core Details</h3>

          <div className="space-y-2">
            <Label htmlFor="title">Competition Title</Label>
            <Input
              id="title"
              placeholder="National Abacus Championship 2025"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the competition, its goals, and rules."
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prize">Prize Details (Optional)</Label>
            <Textarea
              id="prize"
              placeholder="1st Place: ₹5000, 2nd Place: ₹2500..."
              rows={3}
              value={form.prizeDetails}
              onChange={(e) => updateField('prizeDetails', e.target.value)}
            />
          </div>
        </section>

        <Separator className="my-6" />

        {/* Configuration */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Configuration</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fee">Enrollment Fee</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">₹</span>
                <Input
                  id="fee"
                  type="number"
                  inputMode="numeric"
                  placeholder="150"
                  value={form.enrollmentFee}
                  onChange={(e) => updateField('enrollmentFee', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Exam Duration (in minutes)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="duration"
                  type="number"
                  inputMode="numeric"
                  placeholder="90"
                  value={form.durationMinutes}
                  onChange={(e) => updateField('durationMinutes', e.target.value)}
                />
                <span className="text-muted-foreground">minutes</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Applicable Grades</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((g) => {
                const checked = form.applicableGrades.includes(g);
                const id = `grade-${g}`;
                return (
                  <div key={g} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggleGrade(g)}
                    />
                    <Label htmlFor={id}>Grade {g}</Label>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Scheduling */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold">Scheduling</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reg-start">Registration Opens On</Label>
              <Input
                id="reg-start"
                type="datetime-local"
                value={form.registrationStart}
                onChange={(e) => updateField('registrationStart', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-end">Registration Closes On</Label>
              <Input
                id="reg-end"
                type="datetime-local"
                value={form.registrationEnd}
                onChange={(e) => updateField('registrationEnd', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp-date">Exam Date</Label>
              <Input
                id="comp-date"
                type="date"
                value={form.competitionDate}
                onChange={(e) => updateField('competitionDate', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Exam Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={form.examStartTime}
                  onChange={(e) => updateField('examStartTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Exam End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={form.examEndTime}
                  onChange={(e) => updateField('examEndTime', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="results-on">Results Announcement On</Label>
              <Input
                id="results-on"
                type="datetime-local"
                value={form.resultsAnnouncement}
                onChange={(e) => updateField('resultsAnnouncement', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* spacer for sticky bar */}
        <div className="h-24" />
      </div>

      {/* Sticky action bar */}
      <div className="bg-background sticky right-0 bottom-0 left-0 z-10 border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 p-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save and Add Questions</Button>
        </div>
      </div>
    </div>
  );
}
