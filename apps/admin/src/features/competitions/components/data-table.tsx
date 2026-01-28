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
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  pageCount,
  pagination: externalPagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const pagination = externalPagination || internalPagination;
  const setPagination = onPaginationChange || setInternalPagination;

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!pageCount,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No competitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      {/* Pagination */}
      {pageCount && pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Page {pagination.pageIndex + 1} of {pageCount}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CompetitionsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function CompetitionsDataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: CompetitionsDataTableProps<TData, TValue>) {
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
        if (!filter || (!(filter as any).from && !(filter as any).to)) return true;
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
