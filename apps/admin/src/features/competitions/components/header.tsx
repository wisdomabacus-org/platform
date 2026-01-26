import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CompetitionsHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Competitions</h2>
        <p className="text-muted-foreground">
          Manage all competitions, from creation to results publication.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => navigate('/competitions/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Competition
        </Button>
      </div>
    </div>
  );
}
