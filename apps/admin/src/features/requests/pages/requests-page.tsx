
import { useState } from 'react';
import { useRequests } from '../hooks/use-requests';
import { requestColumns } from '../components/columns';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export default function RequestsPage() {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<string>('all');
    const [status, setStatus] = useState<string>('all');

    const filters = {
        search,
        type: type === 'all' ? undefined : type as any,
        status: status === 'all' ? undefined : status,
    };

    const { data: response, isLoading } = useRequests(filters);

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
                <p className="text-muted-foreground">Manage withdrawals, contact forms, and support tickets.</p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="contact">Contact Forms</SelectItem>
                            <SelectItem value="demo">Demo Requests</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                    columns={requestColumns}
                    data={response?.data || []}
                // Client-side pagination for this merged view is fine as it's limited to 100 rows in service
                />
            )}
        </div>
    );
}
