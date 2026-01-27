
import { useState } from 'react';
import { QuestionBanksHeader } from '../components/header';
import { DataTable } from '@/shared/components/data-table/DataTable';
import { questionBankColumns } from '../components/columns';
import { useQuestionBanks } from '../hooks/use-question-banks';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export default function QuestionBanksPage() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState('');
    const [isActive, setIsActive] = useState<string>('all');

    const filters = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        search,
        isActive: isActive === 'all' ? undefined : isActive === 'active'
    };

    const { data: response, isLoading } = useQuestionBanks(filters);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: string) => {
        setIsActive(val);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <QuestionBanksHeader />

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search question banks..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Select value={isActive} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
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
                    columns={questionBankColumns}
                    data={response?.data || []}
                    rowCount={response?.total || 0}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </div>
    );
}
