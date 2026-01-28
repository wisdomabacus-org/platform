import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { useQuestionBanks } from '../hooks/use-question-banks';
import { Button } from '@/shared/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { QuestionBankFilters, BankType } from '../types/question-bank.types';
import { columns } from '../components/columns';
import { DataTable } from '../../competitions/components/data-table'; // Reuse DataTable
import { Skeleton } from '@/shared/components/ui/skeleton';

function TableSkeleton() {
    return (
        <div className="rounded-md border">
            {/* Simple list skeleton */}
            <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function QuestionBanksPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<QuestionBankFilters>({
        search: '',
        isActive: undefined,
        bankType: undefined,
        status: undefined,
    });
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

    // Derived state for table loading
    const { data: result, isLoading: isInitialLoading, isFetching } = useQuestionBanks({
        ...filters,
        page: pagination.pageIndex,
        limit: pagination.pageSize,
    });

    const questionBanks = result?.data || [];
    const totalCount = result?.total || 0;

    // Show skeleton only on initial load or when refetching with empty data (unlikely for refetch)
    // Better UX: Show skeleton only if table is empty AND fetching
    const isLoading = isInitialLoading || (isFetching && questionBanks.length === 0);

    const handleRowClick = (id: string) => {
        navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', id));
    };

    return (
        <div className="flex flex-col gap-6 px-4 py-6">
            <PageHeader title="Question Banks" description="Manage banks of questions for competitions and mock tests.">
                <Button onClick={() => navigate(ROUTES.QUESTION_BANKS_CREATE)} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Question Bank
                </Button>
            </PageHeader>

            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters(prev => ({ ...prev, search: e.target.value }));
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="h-9 pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />

                    {/* Type Filter */}
                    <Select
                        value={filters.bankType || 'all'}
                        onValueChange={(val) => {
                            setFilters(prev => ({ ...prev, bankType: val === 'all' ? undefined : val as BankType }));
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                    >
                        <SelectTrigger className="h-9 w-[150px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="mock_test">Mock Test</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
                        onValueChange={(val) => {
                            const isActive = val === 'all' ? undefined : val === 'active';
                            setFilters(prev => ({ ...prev, isActive }));
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                    >
                        <SelectTrigger className="h-9 w-[150px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <DataTable
                    columns={columns}
                    data={questionBanks}
                    onRowClick={(row) => handleRowClick(row.id)}
                    pageCount={Math.ceil(totalCount / pagination.pageSize)}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </div>
    );
}
