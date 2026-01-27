import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateEnrollmentModal } from './modals/create-enrollment-modal';
import { useCreateEnrollment } from '../hooks/use-enrollments';

export function EnrollmentsHeader() {
  const [open, setOpen] = useState(false);
  const { mutate: createEnrollment, isPending } = useCreateEnrollment();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Enrollments</h2>
        <p className="text-muted-foreground">Track registrations and payment statuses.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Enroll User
        </Button>
      </div>

      <CreateEnrollmentModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={(data) => createEnrollment(data, { onSuccess: () => setOpen(false) })}
        isLoading={isPending}
      />
    </div>
  );
}
