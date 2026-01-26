import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { Filter, Columns2, Calendar as CalendarIcon } from 'lucide-react';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';

import type { Competition } from '../types/competition.types';
interface ToolbarProps {
  table: Table<Competition>;
}

export function CompetitionsTableToolbar({ table }: ToolbarProps) {
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  // Columns (ids must match definitions)
  const publishedCol = table.getColumn('isPublished');
  const gradeCol = table.getColumn('applicableGrades');
  const resultsCol = table.getColumn('isResultsPublished');
  const registrationCol = table.getColumn('registration'); // filterFn: withinRegistration

  // Distinct grades for mock
  const rows = table.getCoreRowModel().rows;
  const distinctGrades = useMemo(
    () =>
      Array.from(
        new Set(
          rows.flatMap((r) =>
            Array.isArray(r.original.applicableGrades) ? r.original.applicableGrades : []
          )
        )
      )
        .filter((x): x is number => typeof x === 'number')
        .sort((a, b) => a - b)
        .slice(0, 10),
    [rows]
  );

  // Inline date range (registration)
  const regFilter = (registrationCol?.getFilterValue() as { from?: Date; to?: Date }) ?? {
    from: undefined,
    to: undefined,
  };
  const setRegFilter = (next: { from?: Date; to?: Date }) =>
    registrationCol?.setFilterValue(next);

  const hasDateFilters = !!regFilter?.from || !!regFilter?.to;

  const hasFilters =
    !!globalFilter ||
    !!publishedCol?.getFilterValue() ||
    !!resultsCol?.getFilterValue() ||
    !!gradeCol?.getFilterValue() ||
    hasDateFilters;

  const resetAll = () => {
    setGlobalFilter('');
    publishedCol?.setFilterValue(undefined);
    gradeCol?.setFilterValue(undefined);
    resultsCol?.setFilterValue(undefined);
    registrationCol?.setFilterValue(undefined);
  };

  const applyBlur = () => (document.activeElement as HTMLElement | null)?.blur?.();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left cluster: Search + Date range */}
      <div className="flex w-full flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search by title..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />

        {/* From date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {regFilter?.from ? regFilter.from.toLocaleDateString() : 'From'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="border-0 bg-transparent p-0 shadow-none"
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={regFilter?.from}
              onSelect={(d) => setRegFilter({ from: d ?? undefined, to: regFilter?.to })}
              defaultMonth={regFilter?.from}
              className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>

        {/* To date (optional) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {regFilter?.to ? regFilter.to.toLocaleDateString() : 'To (optional)'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="border-0 bg-transparent p-0 shadow-none"
          >
            <Calendar
              mode="single"
              captionLayout="dropdown" // show month & year dropdowns
              selected={regFilter?.to}
              onSelect={(d) =>
                setRegFilter({ from: regFilter?.from, to: d ?? undefined })
              }
              defaultMonth={regFilter?.to ?? regFilter?.from}
              className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>
        {(regFilter?.from || regFilter?.to) && (
          <button
            type="button"
            onClick={() => setRegFilter({ from: undefined, to: undefined })}
            className="text-muted-foreground text-sm underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
        {hasFilters ? <Badge variant="outline">Filters active</Badge> : null}
      </div>

      {/* Right cluster: Filters (status/grade/results), Columns, Export */}
      <div className="flex items-center gap-2">
        {/* Filters (dropdown with selects) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 space-y-3 p-3">
            {/* Status */}
            <div className="space-y-1">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <Select
                value={(publishedCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => {
                  if (!publishedCol) return;
                  if (v === 'all') publishedCol.setFilterValue(undefined);
                  if (v === 'draft') publishedCol.setFilterValue(false);
                  if (v === 'published') publishedCol.setFilterValue(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenuSeparator />

            {/* Grade */}
            <div className="space-y-1">
              <DropdownMenuLabel>Grade</DropdownMenuLabel>
              <Select
                value={String(gradeCol?.getFilterValue() ?? 'all')}
                onValueChange={(v) =>
                  gradeCol?.setFilterValue(v === 'all' ? undefined : Number(v))
                }
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

            <DropdownMenuSeparator />

            {/* Results */}
            <div className="space-y-1">
              <DropdownMenuLabel>Results</DropdownMenuLabel>
              <Select
                value={(resultsCol?.getFilterValue() as string) ?? 'all'}
                onValueChange={(v) => {
                  if (!resultsCol) return;
                  if (v === 'all') resultsCol.setFilterValue(undefined);
                  if (v === 'pending') resultsCol.setFilterValue(false);
                  if (v === 'published') resultsCol.setFilterValue(true);
                }}
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

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" onClick={resetAll}>
                Reset
              </Button>
              <Button onClick={applyBlur}>Apply</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columns toggle */}
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
                    className="accent-foreground h-4 w-4"
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

        {/* Export (placeholder) */}
        <Button variant="outline" disabled>
          Export
        </Button>
      </div>
    </div>
  );
}
