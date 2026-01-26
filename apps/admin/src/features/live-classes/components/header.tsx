import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { useLiveClassUiStore } from '../store/live-classes-ui.store';

export function LiveClassesHeader() {
  const { openCreate } = useLiveClassUiStore();
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Live Classes</h2>
        <p className="text-muted-foreground">Manage class schedules, links, and materials.</p>
      </div>
      <div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Live Class
        </Button>
      </div>
    </div>
  );
}
