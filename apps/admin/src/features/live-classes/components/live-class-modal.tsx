import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';

import { useLiveClassUiStore } from '../store/live-classes-ui.store';
import type { LiveClassInfo } from '../types/live-class.types';

type Payload = Omit<LiveClassInfo, 'id'>;

interface Props {
  onSubmit?: (values: Payload) => void;
}

export function LiveClassModal({ onSubmit }: Props) {
  const { modalOpen, mode, editing, close } = useLiveClassUiStore();

  // Local UI state (no RHF)
  const [title, setTitle] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  const [nextTopic, setNextTopic] = useState('');
  const [nextClassAt, setNextClassAt] = useState(''); // yyyy-MM-ddTHH:mm
  const [scheduleInfo, setScheduleInfo] = useState('');
  const [tags, setTags] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Prefill for edit
  useEffect(() => {
    if (modalOpen && mode === 'edit' && editing) {
      setTitle(editing.title ?? '');
      setMeetLink(editing.meetLink ?? '');
      setMaterialLink(editing.materialLink ?? '');
      setNextTopic(editing.nextTopic ?? '');
      setNextClassAt(
        editing.nextClassAt
          ? new Date(editing.nextClassAt).toISOString().slice(0, 16)
          : ''
      );
      setScheduleInfo(editing.scheduleInfo ?? '');
      setIsActive(!!editing.isActive);
      setTags((editing.tags || []).join(', '));
    }
    if (modalOpen && mode === 'create') {
      setTitle('');
      setMeetLink('');
      setMaterialLink('');
      setNextTopic('');
      setNextClassAt('');
      setScheduleInfo('');
      setIsActive(true);
      setTags('');
    }
  }, [modalOpen, mode, editing]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload: Payload = {
      title: title.trim() || undefined,
      meetLink: meetLink.trim(),
      materialLink: materialLink.trim(),
      nextTopic: nextTopic.trim(),
      nextClassAt: nextClassAt ? new Date(nextClassAt) : new Date(),
      scheduleInfo: scheduleInfo.trim(),
      isActive,
      tags: tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSubmit?.(payload);
    setSubmitting(false);
    close();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Live Class' : 'Create Live Class'}
          </DialogTitle>
          <DialogDescription>
            Configure schedule, links, and visibility. These settings can be updated
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Beginner Batch A"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetLink">Meeting link</Label>
            <Input
              id="meetLink"
              placeholder="https://meet.google.com/..."
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialLink">Material link (optional)</Label>
            <Input
              id="materialLink"
              placeholder="https://drive.google.com/..."
              value={materialLink}
              onChange={(e) => setMaterialLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextTopic">Next topic</Label>
            <Input
              id="nextTopic"
              placeholder="Abacus L2: Speed Drills"
              value={nextTopic}
              onChange={(e) => setNextTopic(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nextClassAt">Next class at</Label>
              <Input
                id="nextClassAt"
                type="datetime-local"
                value={nextClassAt}
                onChange={(e) => setNextClassAt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleInfo">Schedule info</Label>
              <Textarea
                id="scheduleInfo"
                placeholder="Tue/Thu 5:00 PM IST"
                rows={2}
                value={scheduleInfo}
                onChange={(e) => setScheduleInfo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="Telugu, English, Beginner"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(v) => setIsActive(!!v)}
            />
            <Label htmlFor="isActive">Active (visible)</Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {mode === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
