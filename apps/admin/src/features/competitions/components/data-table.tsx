import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { CompetitionsTableToolbar } from './table-toolbar';
import type { Competition } from '../types/competition.types';
import { PaginationBar } from '@/shared/components/pagination-bar';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function CompetitionsDataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    filterFns: {
      includesGrade: (row, columnId, filterValue) => {
        const arr = row.getValue<number[]>(columnId) || [];
        if (filterValue == null) return true;
        return Array.isArray(arr) && arr.includes(Number(filterValue));
      },
      withinRegistration: (row, _columnId, filter) => {
        if (!filter || (!filter.from && !filter.to)) return true;
        const from = (filter as any).from ? new Date((filter as any).from) : undefined;
        const to = (filter as any).to ? new Date((filter as any).to) : undefined;

        const start = new Date((row.original as any).registrationStartDate);
        const end = new Date((row.original as any).registrationEndDate);

        const afterFrom = from ? end >= from : true;
        const beforeTo = to ? start <= to : true;
        return afterFrom && beforeTo;
      },
      onExamDate: (row, _columnId, filter) => {
        if (!filter) return true;
        const target = new Date((row.original as any).competitionDate);
        const day = new Date(filter as any);
        return (
          target.getFullYear() === day.getFullYear() &&
          target.getMonth() === day.getMonth() &&
          target.getDate() === day.getDate()
        );
      },
    },
  });

  return (
    <div className="space-y-4">
      <CompetitionsTableToolbar
        table={table as any as import('@tanstack/react-table').Table<Competition>}
      />
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className={h.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' ? ' ▲' : null}
                    {h.column.getIsSorted() === 'desc' ? ' ▼' : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>
      <div className="flex w-full items-center justify-end">
        <PaginationBar table={table} />
      </div>
    </div>
  );
}
