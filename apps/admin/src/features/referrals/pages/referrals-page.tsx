
import { useMemo } from 'react';
import { useReferrers, useCreateReferrer } from '../hooks/use-referrals';
import { ReferralsDataTable } from '../components/data-table';
import { CreateReferrerModal } from '../components/create-referrer-modal';
import { Loader2 } from 'lucide-react';

export default function ReferralsPage() {
    const { data: referrers, isLoading } = useReferrers();
    const { mutate: createReferrer } = useCreateReferrer();

    // Sort logic
    const data = useMemo(() => {
        if (!referrers) return [];
        return referrers.sort((a, b) => b.totalReferrals - a.totalReferrals);
    }, [referrers]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Referrals</h1>
                    <p className="text-muted-foreground">Manage referral partners and track performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <CreateReferrerModal onConfirm={createReferrer} />
                </div>
            </div>

            <ReferralsDataTable data={data} />
        </div>
    );
}
