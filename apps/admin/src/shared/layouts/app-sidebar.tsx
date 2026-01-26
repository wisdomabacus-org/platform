import { SquareSigma } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/components/ui/sidebar';
import { NavMain } from './components/nav-main';
import { NavUser } from './components/nav-user';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { navigationItems } from './navigation-config';
import { ROUTES } from '@/config/constants';

export function AppSidebar() {
  const admin = useAuthStore((state) => state.admin);

  if (!admin) return null;

  return (
    <Sidebar variant="inset" collapsible="none" className="md:w-[13%] h-screen max-h-screen min-h-screen border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTES.DASHBOARD}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SquareSigma className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Wisdom Abacus</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={admin} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
