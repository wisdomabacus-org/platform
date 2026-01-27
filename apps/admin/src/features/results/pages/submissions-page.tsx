
import { useState } from 'react';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { submissionColumns } from '../components/submissions/columns';
import { useSubmissions } from '../hooks/use-results';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export default function SubmissionsPage() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [examType, setExamType] = useState<string>('all');
    const [status, setStatus] = useState<string>('all');

    const filters = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        examType: examType === 'all' ? undefined : examType,
        status: status === 'all' ? undefined : status,
    };

    const { data: response, isLoading } = useSubmissions(filters);

    const handleExamTypeChange = (val: string) => {
        setExamType(val);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
                    <p className="text-muted-foreground">Detailed logs of all exams taken.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <Select value={examType} onValueChange={handleExamTypeChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Exam Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="mock_test">Mock Test</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
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
                    columns={submissionColumns}
                    data={response?.data || []}
                    rowCount={response?.total || 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </div>
    );
}
