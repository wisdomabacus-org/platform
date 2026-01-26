import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { SlidersHorizontal, Columns2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { User } from '../types/user.types';
import { AuthProvider, UserStatus } from '../types/user.types';

// Shared helper: coercion to undefined for "any"
const toFilterValue = (v: string) => (v === 'any' ? undefined : v);

interface ToolbarProps {
  table: Table<User>;
}

export function UsersTableToolbar({ table }: ToolbarProps) {
  // Global search
  const globalFilter = (table.getState() as any).globalFilter ?? '';
  const setGlobalFilter = table.setGlobalFilter;

  const statusCol = table.getColumn('status');
  const providerCol = table.getColumn('authProvider');
  const gradeCol = table.getColumn('studentGrade');
  const cityCol = table.getColumn('city');
  const stateCol = table.getColumn('state');
  const profileCol = table.getColumn('isProfileComplete');

  const distinct = <K extends keyof any>(arr: any[], key: K) =>
    Array.from(new Set(arr.map((r) => r?.original?.[key]).filter(Boolean))).slice(0, 50);

  const rows = table.getCoreRowModel().rows; // current full data set
  const cities = useMemo(() => distinct(rows, 'city'), [rows]);
  const states = useMemo(() => distinct(rows, 'state'), [rows]);
  const grades = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r?.original?.studentGrade).filter(Boolean))
      ).sort((a, b) => a! - b!),
    [rows]
  );

  // Current filter states
  const filtersActive = useMemo(() => {
    const st = !!statusCol?.getFilterValue();
    const pr = !!providerCol?.getFilterValue();
    const gr = !!gradeCol?.getFilterValue();
    const ci = !!cityCol?.getFilterValue();
    const stt = !!stateCol?.getFilterValue();
    const pf = !!profileCol?.getFilterValue();
    const g = !!globalFilter;

    return { st, pr, gr, ci, stt, pf, g };
  }, [statusCol, providerCol, gradeCol, cityCol, stateCol, profileCol, globalFilter]);

  const hasAnyFilter =
    filtersActive.g ||
    filtersActive.st ||
    filtersActive.pr ||
    filtersActive.gr ||
    filtersActive.ci ||
    filtersActive.stt ||
    filtersActive.pf;

  const clearAll = () => {
    setGlobalFilter('');
    statusCol?.setFilterValue(undefined);
    providerCol?.setFilterValue(undefined);
    gradeCol?.setFilterValue(undefined);
    cityCol?.setFilterValue(undefined);
    stateCol?.setFilterValue(undefined);
    profileCol?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      {/* Left: Search */}
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search name, parent, email, phone…"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />

        {/* Active filter badges (optional visual feedback) */}
        <div className="hidden flex-wrap items-center gap-1 md:flex">
          {filtersActive.st && <Badge variant="outline">Status</Badge>}
          {filtersActive.pr && <Badge variant="outline">Provider</Badge>}
          {filtersActive.gr && <Badge variant="outline">Grade</Badge>}
          {filtersActive.ci && <Badge variant="outline">City</Badge>}
          {filtersActive.stt && <Badge variant="outline">State</Badge>}
          {filtersActive.pf && <Badge variant="outline">Profile</Badge>}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Filters popover (modular) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasAnyFilter ? (
                <Badge variant="secondary" className="ml-1">
                  ●
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 space-y-3">
            {/* Status */}
            {statusCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">Status</div>
                <Select
                  value={(statusCol.getFilterValue() as string) ?? 'any'}
                  onValueChange={(v) => statusCol.setFilterValue(toFilterValue(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={UserStatus.BANNED}>Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Provider */}
            {providerCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">Provider</div>
                <Select
                  value={(providerCol.getFilterValue() as string) ?? 'any'}
                  onValueChange={(v) => providerCol.setFilterValue(toFilterValue(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value={AuthProvider.GOOGLE}>Google</SelectItem>
                    <SelectItem value={AuthProvider.PHONE}>Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Grade */}
            {gradeCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">Grade</div>
                <Select
                  value={String(gradeCol.getFilterValue() ?? 'any')}
                  onValueChange={(v) =>
                    gradeCol.setFilterValue(v === 'any' ? undefined : Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {grades.map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* City */}
            {cityCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">City</div>
                <Select
                  value={(cityCol.getFilterValue() as string) ?? 'any'}
                  onValueChange={(v) => cityCol.setFilterValue(toFilterValue(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {cities.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* State */}
            {stateCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">State</div>
                <Select
                  value={(stateCol.getFilterValue() as string) ?? 'any'}
                  onValueChange={(v) => stateCol.setFilterValue(toFilterValue(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {states.map((s: string) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Profile completeness */}
            {profileCol && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-medium">
                  Profile completeness
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={profileCol.getFilterValue() === true}
                      onCheckedChange={(v) =>
                        profileCol.setFilterValue(v ? true : undefined)
                      }
                      id="pf-complete"
                    />
                    <label
                      htmlFor="pf-complete"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Complete
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={clearAll}>
                Reset
              </Button>
              <Button onClick={() => (document.activeElement as HTMLElement)?.blur()}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Columns popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Columns2 className="h-4 w-4" />
              Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <div className="space-y-1">
              {table
                .getAllLeafColumns()
                .filter((c) => c.getCanHide())
                .map((column) => {
                  const id = `col-${column.id}`;
                  return (
                    <div key={column.id} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(v) => column.toggleVisibility(!!v)}
                      />
                      <label htmlFor={id} className="text-sm">
                        {column.id}
                      </label>
                    </div>
                  );
                })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Export action */}
        <Button
          onClick={() =>
            console.log('Export selected', table.getSelectedRowModel().rows.length)
          }
        >
          Export
        </Button>
      </div>
    </div>
  );
}
