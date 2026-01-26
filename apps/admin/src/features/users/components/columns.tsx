import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { User, UserStatus, AuthProvider } from '../types/user.types';

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === UserStatus.BANNED) {
    return <Badge variant="destructive">Banned</Badge>;
  }
  return <Badge variant="secondary">Active</Badge>;
}

function ProviderBadge({ provider }: { provider: AuthProvider }) {
  return (
    <Badge variant="outline">{provider === AuthProvider.GOOGLE ? 'Google' : 'Phone'}</Badge>
  );
}

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
    accessorKey: 'studentName',
    header: 'Student',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.studentName ?? '—'}</div>
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
    cell: ({ row }) => <ProviderBadge provider={row.original.authProvider} />,
    size: 100,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.phone ?? '—',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email ?? '—',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    size: 100,
  },
  {
    accessorKey: 'isProfileComplete',
    header: 'Profile',
    cell: ({ row }) => (row.original.isProfileComplete ? 'Complete' : 'Incomplete'),
    size: 110,
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
    cell: ({ row }) => {
      const u = row.original;
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
            <DropdownMenuItem onClick={() => console.log('View', u.id)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Impersonate', u.id)}>
              Impersonate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Ban/Unban', u.id)}>
              Toggle status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
