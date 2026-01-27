
import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Filter, Columns2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import type { Payment } from '../types/payment.types';

interface Props {
  table: Table<Payment>;
}

export function PaymentsTableToolbar({ table }: Props) {
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  const statusCol = table.getColumn('status');
  // const methodCol = table.getColumn('method'); // If method exists in schema

  const createdCol = table.getColumn('createdAt');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const applyDate = (f?: string, t?: string) => {
    if (!f && !t) createdCol?.setFilterValue(undefined);
    else createdCol?.setFilterValue({ from: f || undefined, to: t || undefined });
  };

  const hasFilters =
    !!globalFilter ||
    !!statusCol?.getFilterValue() ||
    !!createdCol?.getFilterValue();

  const reset = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    setFrom('');
    setTo('');
    createdCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search Order ID, Payment ID..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />

        {/* Date Range Inputs */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              applyDate(e.target.value, to);
            }}
            className="w-[140px]"
            aria-label="From date"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              applyDate(from, e.target.value);
            }}
            className="w-[140px]"
            aria-label="To date"
          />
        </div>

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
          <PopoverContent align="end" className="w-64 space-y-3">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Status</div>
              <Select
                value={(statusCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => statusCol?.setFilterValue(v === 'all' ? undefined : v)}
              >
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
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
