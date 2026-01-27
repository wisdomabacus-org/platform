
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Separator } from "@/shared/components/ui/separator"
import { DynamicBreadcrumb } from "@/shared/components/dynamic-breadcrumb"
import { ThemeToggle } from "@/shared/components/theme-toggle"

export function TopBar() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
            </div>
        </header>
    )
}
