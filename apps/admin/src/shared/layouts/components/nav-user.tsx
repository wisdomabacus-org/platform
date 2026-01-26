import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { useLogout } from '@/features/auth/hooks/use-auth';
import type { Admin } from '@/features/auth/types/auth.types';

interface NavUserProps {
  user: Admin;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { mutate: logout, isPending } = useLogout();

  const userInitial = user.username?.charAt(0).toUpperCase() || 'A';
  const displayName = user.name || user.username || 'Admin';

  const createdAt = (user as any)?.createdAt ? new Date((user as any).createdAt) : null;
  const updatedAt = (user as any)?.updatedAt ? new Date((user as any).updatedAt) : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">Administrator</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
              w-[--radix-dropdown-menu-trigger-width] min-w-60 overflow-hidden rounded-xl
              border bg-gradient-to-b from-white/30 to-white/10
              shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/15
            "
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={6}
          >
            {/* Profile card */}
            <div className="p-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg ring-1 ring-white/30">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{displayName}</div>
                  <div className="truncate text-xs text-muted-foreground">@{user.username}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-white/20 bg-white/10 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Joined</div>
                  <div className="mt-0.5 font-medium">
                    {createdAt ? createdAt.toLocaleDateString() : '—'}
                  </div>
                </div>
                <div className="rounded-md border border-white/20 bg-white/10 p-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Updated</div>
                  <div className="mt-0.5 font-medium">
                    {updatedAt ? updatedAt.toLocaleDateString() : '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20" />

            {/* Single logout action */}
            <button
              type="button"
              onClick={() => logout()}
              disabled={isPending}
              className="
                group flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm
                transition-colors hover:bg-white/10
              "
            >
              <LogOut
                className="
                  h-4 w-4 text-muted-foreground transition-colors
                  group-hover:text-red-500
                "
              />
              <span
                className="
                  truncate text-foreground transition-colors
                  group-hover:text-black
                "
              >
                {isPending ? 'Logging out...' : 'Log out'}
              </span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
