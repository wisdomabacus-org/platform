
import { ColumnDef } from '@tanstack/react-table';
import { Referrer } from '../types/referrals.types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Link as LinkIcon, Copy } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { toast } from 'sonner';

const copyLink = (code: string) => {
    // Determine domain based on environment or default
    const domain = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://wisdomabacus.com';
    const link = `${domain}?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard');
};

export const referrerColumns: ColumnDef<Referrer>[] = [
    {
        accessorKey: 'name',
        header: 'Referrer Name',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground">{row.original.email}</span>
            </div>
        ),
    },
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{row.original.code}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyLink(row.original.code)}>
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        ),
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => row.original.phone || '—',
    },
    {
        accessorKey: 'totalReferrals',
        header: 'Total Referrals',
        cell: ({ row }) => <span className="font-semibold">{row.original.totalReferrals}</span>,
    },
    {
        accessorKey: 'totalConversions',
        header: 'Conversions',
        cell: ({ row }) => <span className="font-semibold text-green-600">{row.original.totalConversions}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return <ReferrerActions referrer={row.original} />;
        },
    },
];

import { ReferrerFormModal } from './create-referrer-modal';
import { useDeleteReferrer, useUpdateReferrer } from '../hooks/use-referrals';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

function ReferrerActions({ referrer }: { referrer: Referrer }) {
    const { mutate: deleteReferrer } = useDeleteReferrer();
    const { mutate: updateReferrer } = useUpdateReferrer();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => copyLink(referrer.code)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ReferrerFormModal
                        referrer={referrer}
                        onConfirm={(data) => {
                            updateReferrer({ ...data, id: referrer.id });
                            setIsMenuOpen(false);
                        }}
                        trigger={
                            <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                Edit Details
                            </div>
                        }
                    />
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the referrer
                            and their associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteReferrer(referrer.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
