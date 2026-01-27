
import { useMemo } from 'react';
import { useRequests } from '../hooks/use-requests';
import { requestColumns } from '../components/columns';
import { RequestsDataTable } from '../components/data-table';
import { Loader2 } from 'lucide-react';

export default function RequestsPage() {
    const { data: requestData, isLoading } = useRequests();
    const data = useMemo(() => requestData?.data || [], [requestData]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
                <p className="text-muted-foreground">Manage withdrawals, contact forms, and support tickets.</p>
            </div>
            <RequestsDataTable columns={requestColumns} data={data} pageSize={10} />
        </div>
    );
}
