
import { useMemo, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Filter, Columns2 } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';

import type { Submission } from '../../types/results.types';

interface Props {
    table: Table<Submission>;
}

export function SubmissionsTableToolbar({ table }: Props) {
    const globalFilter = (table.getState() as any).globalFilter ?? '';
    const setGlobalFilter = table.setGlobalFilter;

    const statusCol = table.getColumn('status');
    const examCol = table.getColumn('examTitle');

    const rows = table.getCoreRowModel().rows;
    const exams = useMemo(
        () => Array.from(new Set(rows.map((r) => r.original.examTitle))).slice(0, 20),
        [rows]
    );

    const hasFilters = !!globalFilter || !!statusCol?.getFilterValue() || !!examCol?.getFilterValue();

    const reset = () => {
        setGlobalFilter('');
        statusCol?.setFilterValue(undefined);
        examCol?.setFilterValue(undefined);
    };

    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search user or exam..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full md:max-w-sm"
                />
                {hasFilters && <Button variant="ghost" onClick={reset}>Reset</Button>}
            </div>

            <div className="flex items-center gap-2">
                {/* Filter Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasFilters && <Badge variant="secondary" className="ml-1">●</Badge>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 space-y-3">
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Exam</div>
                            <Select
                                value={(examCol?.getFilterValue() as string) ?? 'all'}
                                onValueChange={(v) => examCol?.setFilterValue(v === 'all' ? undefined : v)}
                            >
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {exams.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Status</div>
                            <Select
                                value={(statusCol?.getFilterValue() as string) ?? 'all'}
                                onValueChange={(v) => statusCol?.setFilterValue(v === 'all' ? undefined : v)}
                            >
                                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Columns Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Columns2 className="h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllLeafColumns()
                            .filter((c) => c.getCanHide())
                            .map((column) => (
                                <div key={column.id} className="flex items-center gap-2 px-2 py-1">
                                    <Checkbox
                                        id={`col-${column.id}`}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                                    />
                                    <label htmlFor={`col-${column.id}`} className="text-sm">
                                        {column.id}
                                    </label>
                                </div>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
