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

import type { CompetitionResultsRow } from '../types/results.types';

interface Props {
  table: Table<CompetitionResultsRow>;
}

export function ResultsTableToolbar({ table }: Props) {
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  const statusCol = table.getColumn('status');
  const gradesCol = table.getColumn('grades');
  const publishedCol = table.getColumn('publishedAt');

  // Inline date range for publishedAt (native inputs)
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const applyDate = (f?: string, t?: string) => {
    if (!f && !t) publishedCol?.setFilterValue(undefined);
    else publishedCol?.setFilterValue({ from: f || undefined, to: t || undefined });
  };

  const rows = table.getCoreRowModel().rows;
  const distinctGrades = useMemo(
    () =>
      Array.from(new Set(rows.flatMap((r) => r.original.grades))).filter(
        (g): g is number => typeof g === 'number'
      ).sort((a, b) => a - b),
    [rows]
  );

  const hasFilters =
    !!globalFilter || !!statusCol?.getFilterValue() || !!gradesCol?.getFilterValue() || !!publishedCol?.getFilterValue();

  const reset = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    gradesCol?.setFilterValue(undefined);
    setFrom('');
    setTo('');
    publishedCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search competition…"
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
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <Select
                value={(statusCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => statusCol?.setFilterValue(v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />

            <div className="space-y-1">
              <DropdownMenuLabel>Grade</DropdownMenuLabel>
              <Select
                value={String(gradesCol?.getFilterValue() ?? 'all')}
                onValueChange={(v) => gradesCol?.setFilterValue(v === 'all' ? undefined : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {distinctGrades.map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      Grade {g}
                    </SelectItem>
                  ))}
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
