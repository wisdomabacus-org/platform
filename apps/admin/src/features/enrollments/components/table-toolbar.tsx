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
} from '@/shared/components/ui/dropdown-menu';
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

  const statusCol = table.getColumn('status');
  const paymentCol = table.getColumn('paymentStatus');
  const competitionCol = table.getColumn('competitionTitle');

  const rows = table.getCoreRowModel().rows;
  const competitions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.original.competitionTitle))).slice(0, 20),
    [rows]
  );

  // Inline date range with native inputs
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const registeredCol = table.getColumn('registeredAt');

  // Push date range as {from, to} to the registeredAt column
  const applyDate = (f?: string, t?: string) => {
    if (!f && !t) {
      registeredCol?.setFilterValue(undefined);
    } else {
      registeredCol?.setFilterValue({ from: f || undefined, to: t || undefined });
    }
  };

  const hasFilters =
    !!globalFilter ||
    !!statusCol?.getFilterValue() ||
    !!paymentCol?.getFilterValue() ||
    !!competitionCol?.getFilterValue() ||
    !!registeredCol?.getFilterValue();

  const reset = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    paymentCol?.setFilterValue(undefined);
    competitionCol?.setFilterValue(undefined);
    setFrom('');
    setTo('');
    registeredCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search user, order id…"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />

        <Input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            applyDate(e.target.value, to);
          }}
          className="w-[150px]"
          aria-label="From date"
          placeholder="From"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            applyDate(from, e.target.value);
          }}
          className="w-[150px]"
          aria-label="To date"
          placeholder="To"
        />

        {hasFilters ? <Badge variant="outline">Filters active</Badge> : null}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 space-y-3 p-3">
            <div className="space-y-1">
              <DropdownMenuLabel>Competition</DropdownMenuLabel>
              <Select
                value={(competitionCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) =>
                  competitionCol?.setFilterValue(v === 'all' ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {competitions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />

            <div className="space-y-1">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <Select
                value={(statusCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) =>
                  statusCol?.setFilterValue(v === 'all' ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />

            <div className="space-y-1">
              <DropdownMenuLabel>Payment</DropdownMenuLabel>
              <Select
                value={(paymentCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) =>
                  paymentCol?.setFilterValue(v === 'all' ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" onClick={reset}>
                Reset
              </Button>
              <Button onClick={() => (document.activeElement as HTMLElement | null)?.blur?.()}>
                Apply
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Columns2 className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <div key={column.id} className="flex items-center gap-2 px-2 py-1">
                  <input
                    id={`col-${column.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-foreground"
                    checked={column.getIsVisible()}
                    onChange={(e) => column.toggleVisibility(e.target.checked)}
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
