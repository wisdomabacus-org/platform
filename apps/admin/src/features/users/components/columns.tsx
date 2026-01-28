
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { User } from '../types/user.types';
import { ROUTES } from '@/config/constants';
import { useUpdateUserStatus, useDeleteUser } from '../hooks/use-users';

const UserActions = ({ user }: { user: User }) => {
  const { mutate: updateStatus } = useUpdateUserStatus();
  const { mutate: deleteUser } = useDeleteUser();

  const isSuspended = user.status === 'suspended';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.USERS_DETAIL.replace(':id', user.id)}>View Details</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isSuspended ? (
          <DropdownMenuItem onClick={() => updateStatus({ id: user.id, status: 'active' })}>
            Activate User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateStatus({ id: user.id, status: 'suspended' })} className="text-orange-600 focus:text-orange-600">
            Suspend User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={!isSuspended}
          onClick={() => {
            if (confirm('Are you sure? This action is irreversible.')) {
              deleteUser(user.id);
            }
          }}
        >
          {isSuspended ? 'Delete User' : 'Suspend to Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const userColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 24,
  },
  {
    accessorKey: 'uid',
    header: 'UID',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.uid.substring(0, 8)}...</span>,
    size: 80,
  },
  {
    accessorKey: 'studentName',
    header: 'Student',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.studentName ?? '—'}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'parentName',
    header: 'Parent',
    cell: ({ row }) => row.original.parentName ?? '—',
  },
  {
    accessorKey: 'studentGrade',
    header: 'Grade',
    cell: ({ row }) => row.original.studentGrade ?? '—',
    size: 60,
  },
  {
    accessorKey: 'authProvider',
    header: 'Provider',
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.authProvider}</Badge>,
    size: 100,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.phone ?? '—',
  },
  {
    accessorKey: 'isProfileComplete',
    header: 'Profile',
    cell: ({ row }) => (
      <Badge variant={row.original.isProfileComplete ? 'default' : 'secondary'}>
        {row.original.isProfileComplete ? 'Complete' : 'Incomplete'}
      </Badge>
    ),
    size: 110,
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleDateString() : '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'suspended' ? 'destructive' : 'outline'}>
        {row.original.status || 'Active'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 48,
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
