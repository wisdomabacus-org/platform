import { Outlet } from 'react-router-dom';
import { getCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { LayoutProvider } from '@/context/layout-provider';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { SkipToMain } from '@/shared/components/skip-to-main';
import { Header } from '@/shared/components/layout/header';
import { Main } from '@/shared/components/layout/main';
import { CommandPalette } from '@/shared/components/command-palette';
import { DynamicBreadcrumb } from '@/shared/components/dynamic-breadcrumb';
import { ThemeToggle } from '@/shared/components/theme-toggle';

function AuthenticatedLayoutInner() {
    const defaultOpen = getCookie('sidebar_state') !== 'false';
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
            <SidebarInset
                className={cn(
                    '@container/content',
                    'has-data-[layout=fixed]:h-svh',
                    'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                )}
            >
                <Header fixed>
                    <DynamicBreadcrumb />
                    <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </Header>
                <Main fixed className="h-full overflow-auto no-scrollbar">
                    <Outlet />
                </Main>
            </SidebarInset>
            <CommandPalette />
        </SidebarProvider>
    );
}

export function AuthenticatedLayout() {
    return (
        <LayoutProvider>
            <AuthenticatedLayoutInner />
        </LayoutProvider>
    );
}
