import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { ROUTES } from '@/config/constants';

const routeNameMap: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.USERS]: 'Users',
  [ROUTES.COMPETITIONS]: 'Competitions',
  [ROUTES.ENROLLMENTS]: 'Enrollments',
  [ROUTES.PAYMENTS]: 'Payments',
  [ROUTES.MOCK_TESTS]: 'Mock Tests',
  [ROUTES.LIVE_CLASSES]: 'Live Classes',
  [ROUTES.QUESTION_BANKS]: 'Question Banks',
  [ROUTES.QUESTION_BANKS_CREATE]: 'Create Bank',
};

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Build breadcrumb items
  const breadcrumbItems = pathnames.map((_, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const name = routeNameMap[path] || pathnames[index];
    const isLast = index === pathnames.length - 1;

    return { path, name, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.path} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {item.isLast ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
