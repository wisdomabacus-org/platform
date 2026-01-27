
import { useMemo, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Filter, Columns2 } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/shared/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import type { Enrollment } from '../types/enrollment.types';

interface Props {
  table: Table<Enrollment>;
}

export function EnrollmentsTableToolbar({ table }: Props) {
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  // Filter columns
  const statusCol = table.getColumn('status');
  const paymentCol = table.getColumn('isPaymentConfirmed');
  // competitionId col is actually filtering competitionTitle in MVP if we rely on table filtering, 
  // but better to use a dedicated filter state if server filtering.
  // We'll stick to client filtering for now as table rows contain the data.
  const competitionCol = table.getColumn('competitionTitle');

  const rows = table.getCoreRowModel().rows;
  const competitions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.original.competitionTitle))).slice(0, 50),
    [rows]
  );

  const hasFilters =
    !!globalFilter ||
    !!statusCol?.getFilterValue() ||
    !!paymentCol?.getFilterValue() ||
    !!competitionCol?.getFilterValue();

  const reset = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    paymentCol?.setFilterValue(undefined);
    competitionCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search user, payment id…"
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
              <div className="text-xs font-medium text-muted-foreground">Competition</div>
              <Select
                value={(competitionCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => competitionCol?.setFilterValue(v === 'all' ? undefined : v)}
              >
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {competitions.map((c) => (
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
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Payment Status</div>
              <Select
                value={paymentCol?.getFilterValue() === undefined ? 'all' : String(paymentCol.getFilterValue())}
                onValueChange={(v) => paymentCol?.setFilterValue(v === 'all' ? undefined : v === 'true')}
              >
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                  <SelectItem value="false">Unpaid</SelectItem>
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
