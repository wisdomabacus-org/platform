
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { TopBar } from '@/shared/components/top-bar';
import { CommandPalette } from '@/shared/components/command-palette';

export function AppShell() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <TopBar />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
            </SidebarInset>
            <CommandPalette />
        </SidebarProvider>
    );
}
