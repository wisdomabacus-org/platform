import { useMemo } from 'react';
import { UsersDataTable } from '../components/data-table';
import { userColumns } from '../components/columns';
import { UsersHeader } from '../components/header';
import { UsersRegisterModal } from '../components/modals/register-modal';
import { BulkUserImportModal } from '../components/modals/bulk-import-modal';
import { useUsers, useBulkCreateUsers } from '../hooks/use-users';
import { useUsersUiStore } from '../store/users-ui.store';
import { Loader2 } from 'lucide-react';

export default function UsersPage() {
  const { data: usersData, isLoading } = useUsers();
  const { importOpen, setImportOpen } = useUsersUiStore();
  const { mutate: bulkCreate, isPending: isImporting } = useBulkCreateUsers();

  // Safe default
  const data = useMemo(() => usersData?.data || [], [usersData]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="w-full flex flex-col h-screen max-h-screen overflow-y-scroll scrollbar-hide gap-y-4 px-8 py-4">
      <UsersHeader />
      <div>
        <UsersDataTable columns={userColumns} data={data} pageSize={10} />
      </div>
      <UsersRegisterModal />
      <BulkUserImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={(users) => bulkCreate(users, { onSuccess: () => setImportOpen(false) })}
        isLoading={isImporting}
      />
    </div>
  );
}
