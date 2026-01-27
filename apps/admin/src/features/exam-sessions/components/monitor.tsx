
import { useState, useMemo } from 'react';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { useActiveExamSessions, useForceFinishSession } from '../hooks/use-exam-sessions.ts';
import { examSessionColumns } from './columns';
import { Loader2, MonitorPlay } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export function ExamSessionsMonitor() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [status, setStatus] = useState<string>('active');

    const filters = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        status: status === 'all' ? undefined : status,
    };

    const { data: response, isLoading, refetch } = useActiveExamSessions(filters);
    const { mutate: forceFinish } = useForceFinishSession();

    const columns = useMemo(() => examSessionColumns(forceFinish), [forceFinish]);

    const handleStatusChange = (val: string) => {
        setStatus(val);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MonitorPlay className="h-5 w-5 text-green-500" />
                    Sessions ({response?.total || 0})
                </h2>
                <div className="flex items-center gap-4">
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="all">All Sessions</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Refresh
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={response?.data || []}
                    rowCount={response?.total || 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </div>
    );
}
