import { Button } from '@/shared/components/ui/button';
import { useUsersUiStore } from '../store/users-ui.store';

export function UsersHeader() {
  const { openRegister } = useUsersUiStore();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage students and parents.</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Additional actions can be placed here later */}
        <Button onClick={openRegister}>Register user</Button>
      </div>
    </div>
  );
}
