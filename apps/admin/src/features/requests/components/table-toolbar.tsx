
import { Table } from '@tanstack/react-table';
import { Filter } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/shared/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { AnyRequest } from '../types/requests.types';

interface Props {
    table: Table<AnyRequest>;
}

export function RequestsTableToolbar({ table }: Props) {
    const globalFilter = (table.getState() as any).globalFilter ?? '';
    const setGlobalFilter = table.setGlobalFilter;

    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search requests..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full md:max-w-sm"
                />
                <Button variant="ghost" onClick={() => setGlobalFilter('')}>Reset</Button>
            </div>
        </div>
    );
}
