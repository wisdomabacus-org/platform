import { useMemo } from 'react';
import { UsersDataTable } from '../components/data-table';
import { userColumns } from '../components/columns';
import { mockUsers } from '../components/mock';
import { UsersHeader } from '../components/header';
import { UsersRegisterModal } from '../components/modals/register-modal';

export default function UsersPage() {
  const data = useMemo(() => mockUsers, []);

  return (
    <div className="w-full flex flex-col h-screen max-h-screen overflow-y-scroll scrollbar-hide gap-y-4 px-8 py-4">
      <UsersHeader />
      <div>
        <UsersDataTable columns={userColumns} data={data} pageSize={10} />
      </div>
      <UsersRegisterModal />
    </div>
  );
}
