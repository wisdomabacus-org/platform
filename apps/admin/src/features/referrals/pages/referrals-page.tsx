
import { useState, useMemo } from 'react';
import { useReferrers, useCreateReferrer } from '../hooks/use-referrals';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { referrerColumns } from '../components/columns';
import { ReferrerFormModal } from '../components/create-referrer-modal';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export default function ReferralsPage() {
    const [search, setSearch] = useState('');
    const { data: referrers, isLoading } = useReferrers();
    const { mutate: createReferrer } = useCreateReferrer();

    // Sort and search logic (client-side for now since it's mixed with mock data)
    const filteredData = useMemo(() => {
        if (!referrers) return [];
        let filtered = [...referrers];
        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(r =>
                r.name?.toLowerCase().includes(lower) ||
                r.code?.toLowerCase().includes(lower)
            );
        }
        return filtered.sort((a, b) => b.totalReferrals - a.totalReferrals);
    }, [referrers, search]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Referrals</h1>
                    <p className="text-muted-foreground">Manage referral partners and track performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <ReferrerFormModal onConfirm={createReferrer} />
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search referrers..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={referrerColumns}
                data={filteredData}
            />
        </div>
    );
}
