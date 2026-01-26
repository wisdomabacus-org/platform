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
import { EnrollmentsTableToolbar } from './table-toolbar';
import type { Enrollment } from '../types/enrollment.types';
import { PaginationBar } from '@/shared/components/pagination-bar';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function EnrollmentsDataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: Props<TData, TValue>) {
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
      // Date range filter for registeredAt
      withinRange: (row, columnId, filter) => {
        if (!filter || (typeof filter === 'object' && !filter.from && !filter.to))
          return true;
        const v = new Date(row.getValue(columnId) as any);
        const from = (filter as any).from ? new Date((filter as any).from) : undefined;
        const to = (filter as any).to ? new Date((filter as any).to) : undefined;
        const afterFrom = from ? v >= from : true;
        const beforeTo = to ? v <= to : true;
        return afterFrom && beforeTo;
      },
    },
  });

  // Ensure the registeredAt column uses withinRange if present
  const registeredCol = table.getColumn('registeredAt');
  if (registeredCol && !registeredCol.getFilterFn()) {
    // Bind by column definition instead if you prefer
    // registeredCol.setFilterFn('withinRange'); // not available; define filterFn on columnDef instead
  }

  return (
    <div className="space-y-4">
      <EnrollmentsTableToolbar
        table={table as any as import('@tanstack/react-table').Table<Enrollment>}
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
