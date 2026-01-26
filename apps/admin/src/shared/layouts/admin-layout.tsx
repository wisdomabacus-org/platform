import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

export function AdminLayout() {
  return (
    <>
      <SidebarProvider>
        <div className='w-screen h-screen flex flex-row overflow-hidden'>
          <AppSidebar />
          <SidebarInset>
            <div className="flex w-full h-full flex-1 flex-col overflow-hidden">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
