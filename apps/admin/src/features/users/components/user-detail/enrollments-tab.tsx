
import { useUserEnrollments } from '../../hooks/use-users';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { format } from 'date-fns';

interface Props {
    userId: string;
}

export function UserEnrollmentsTab({ userId }: Props) {
    const { data: enrollments, isLoading } = useUserEnrollments(userId);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No enrollments found.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Competition</TableHead>
                        <TableHead>Season</TableHead>
                        <TableHead>Enrolled At</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrollments.map((e: any) => (
                        <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.competition?.title || 'Unknown'}</TableCell>
                            <TableCell>{e.competition?.season || '—'}</TableCell>
                            <TableCell>{format(new Date(e.created_at), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant={e.payment_status === 'paid' ? 'default' : 'secondary'}>
                                    {e.payment_status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{e.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
