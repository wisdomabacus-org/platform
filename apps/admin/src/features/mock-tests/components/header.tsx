import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

export function MockTestsHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mock Tests</h2>
        <p className="text-muted-foreground">
          Create practice tests and publish for learners to self-score instantly.
        </p>
      </div>
      <div>
        <Button asChild>
          <Link to={ROUTES.MOCK_TESTS_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            New Mock Test
          </Link>
        </Button>
      </div>
    </div>
  );
}
