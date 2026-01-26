import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Separator } from '@/shared/components/ui/separator';
import { DynamicBreadcrumb } from '@/shared/layouts/components/dynamic-breadcrumb';

interface PageHeaderProps {
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
}

export function PageHeader({
  title,
  description,
  showBreadcrumb = true,
}: PageHeaderProps) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/85 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {showBreadcrumb && <DynamicBreadcrumb />}
      </div>
      {(title || description) && (
        <div className="border-t px-4 py-4">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  );
}
