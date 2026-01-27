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
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { navigationGroups } from '@/config/navigation';
import { ROUTES } from '@/config/constants';

export function AppSidebar() {
  const admin = useAuthStore((state) => state.admin);

  if (!admin) return null;

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTES.DASHBOARD}>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
        <NavMain groups={navigationGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={admin} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
