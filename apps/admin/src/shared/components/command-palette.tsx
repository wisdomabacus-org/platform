import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/shared/components/ui/command';
import { navigationGroups } from '@/config/navigation';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // We might not have theme provider set up yet effectively, checking imports later. Assuming simple toggle if needed.
    // actually, let's keep theme out for a split second or assume standard hook.

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {navigationGroups.map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <CommandItem
                                    key={item.title}
                                    onSelect={() => runCommand(() => navigate(item.url))}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
}
