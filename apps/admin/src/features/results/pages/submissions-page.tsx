
import { useMemo } from 'react';
import { SubmissionsDataTable } from '../../components/submissions/data-table';
import { submissionColumns } from '../../components/submissions/columns';
import { useSubmissions } from '../../hooks/use-results';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function SubmissionsPage() {
    const { data: submissionsData, isLoading } = useSubmissions();
    const data = useMemo(() => submissionsData?.data || [], [submissionsData]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
                    <p className="text-muted-foreground">Detailed logs of all exams taken.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            <SubmissionsDataTable columns={submissionColumns} data={data} pageSize={10} />
        </div>
    );
}
