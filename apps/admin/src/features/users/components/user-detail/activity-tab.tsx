
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2, CreditCard, BookOpen } from 'lucide-react';
import { useUserPayments, useUserMockTestAttempts } from '../../hooks/use-users';
import { format } from 'date-fns';

interface Props {
    userId: string;
}

const currencyINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const statusVariant = (status: string) => {
    switch (status) {
        case 'success': return 'default';
        case 'failed': return 'destructive';
        default: return 'secondary';
    }
};

export function UserActivityTab({ userId }: Props) {
    const { data: payments, isLoading: loadingPayments } = useUserPayments(userId);
    const { data: attempts, isLoading: loadingAttempts } = useUserMockTestAttempts(userId);

    return (
        <div className="space-y-6">
            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingPayments ? (
                        <div className="flex justify-center p-6">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : !payments || payments.length === 0 ? (
                        <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                            No payment records found.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Amount</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Purpose</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Gateway ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p: any) => (
                                        <tr key={p.id} className="border-b last:border-0">
                                            <td className="px-4 py-2 text-xs">{format(p.createdAt, 'MMM d, yyyy')}</td>
                                            <td className="px-4 py-2 font-medium">{currencyINR(p.amount)}</td>
                                            <td className="px-4 py-2 text-muted-foreground capitalize">{p.purpose || '—'}</td>
                                            <td className="px-4 py-2">
                                                <Badge variant={statusVariant(p.status)} className="capitalize">
                                                    {p.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="font-mono text-xs">{p.razorpayPaymentId || '—'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mock Test Attempts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Mock Test Attempts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingAttempts ? (
                        <div className="flex justify-center p-6">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : !attempts || attempts.length === 0 ? (
                        <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                            No mock test attempts found.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Test Name</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Difficulty</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Score</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">%</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((a: any) => (
                                        <tr key={a.id} className="border-b last:border-0">
                                            <td className="px-4 py-2 font-medium">{a.mockTestTitle}</td>
                                            <td className="px-4 py-2">
                                                <Badge variant="outline" className="capitalize">{a.mockTestDifficulty}</Badge>
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs">
                                                {a.score}/{a.totalMarks}
                                            </td>
                                            <td className="px-4 py-2 font-medium">
                                                <span className={a.percentage >= 60 ? 'text-green-600' : a.percentage >= 30 ? 'text-yellow-600' : 'text-red-500'}>
                                                    {a.percentage}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Badge variant={a.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                                    {a.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-xs text-muted-foreground">
                                                {format(a.submittedAt, 'MMM d, yyyy')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
