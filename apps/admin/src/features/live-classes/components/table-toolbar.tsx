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

import type { LiveClassInfo } from '../types/live-class.types';

interface Props {
  table: Table<LiveClassInfo>;
}

export function LiveClassesTableToolbar({ table }: Props) {
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  const statusCol = table.getColumn('isActive');
  const tagsCol = table.getColumn('tags');
  const nextCol = table.getColumn('nextClassAt');

  const rows = table.getCoreRowModel().rows;
  const distinctTags = useMemo(() => {
    const all = rows.flatMap((r) => r.original.tags || []);
    return Array.from(new Set(all)).slice(0, 20);
  }, [rows]);

  // Inline date range by native inputs
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const applyDate = (f?: string, t?: string) => {
    if (!f && !t) nextCol?.setFilterValue(undefined);
    else nextCol?.setFilterValue({ from: f || undefined, to: t || undefined });
  };

  const hasFilters =
    !!globalFilter || !!statusCol?.getFilterValue() || !!tagsCol?.getFilterValue() || !!nextCol?.getFilterValue();

  const reset = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    tagsCol?.setFilterValue(undefined);
    setFrom('');
    setTo('');
    nextCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search title, topic…"
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
                onValueChange={(v) => {
                  if (!statusCol) return;
                  if (v === 'all') statusCol.setFilterValue(undefined);
                  if (v === 'active') statusCol.setFilterValue(true);
                  if (v === 'hidden') statusCol.setFilterValue(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />

            <div className="space-y-1">
              <DropdownMenuLabel>Tag</DropdownMenuLabel>
              <Select
                value={(tagsCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => tagsCol?.setFilterValue(v === 'all' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {distinctTags.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
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
