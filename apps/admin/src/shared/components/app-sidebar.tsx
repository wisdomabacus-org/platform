import { useLayout } from '@/context/layout-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/components/ui/sidebar';
import { NavGroup } from './layout/nav-group';
import { NavUser } from './nav-user';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { navigationGroups } from '@/config/navigation';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const admin = useAuthStore((state) => state.admin);

  if (!admin) return null;

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTES.DASHBOARD}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/logo.png" alt="Wisdom Abacus" className="size-8 object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Wisdom Abacus</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationGroups.map((props) => (
          <NavGroup key={props.label} title={props.label} items={props.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={admin} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
