
import { useState } from 'react';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { userColumns } from '../components/columns';
import { UsersHeader } from '../components/header';
import { UsersRegisterModal } from '../components/modals/register-modal';
import { BulkUserImportModal } from '../components/modals/bulk-import-modal';
import { useUsers, useBulkCreateUsers } from '../hooks/use-users';
import { useUsersUiStore } from '../store/users-ui.store';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function UsersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [authProvider, setAuthProvider] = useState<string>('all');

  const { importOpen, setImportOpen } = useUsersUiStore();
  const { mutate: bulkCreate, isPending: isImporting } = useBulkCreateUsers();

  const filters = {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    search,
    authProvider: authProvider === 'all' ? undefined : authProvider
  };

  const { data: response, isLoading } = useUsers(filters);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleProviderChange = (val: string) => {
    setAuthProvider(val);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
      <UsersHeader />

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, email, phone or UID..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={authProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Auth Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={userColumns}
          data={response?.data || []}
          rowCount={response?.total || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}

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
