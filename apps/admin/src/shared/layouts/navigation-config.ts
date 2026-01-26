import {
  LayoutDashboard,
  Users,
  Trophy,
  Receipt,
  CreditCard,
  Award,
  FileText,
  Video,
} from 'lucide-react';
import { ROUTES } from '@/config/constants';
import type { NavItem } from './components/nav-main';

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    url: ROUTES.USERS,
    icon: Users,
  },
  {
    title: 'Competitions',
    url: ROUTES.COMPETITIONS,
    icon: Trophy,
  },
  {
    title: 'Enrollments',
    url: ROUTES.ENROLLMENTS,
    icon: Receipt,
  },
  {
    title: 'Payments',
    url: ROUTES.PAYMENTS,
    icon: CreditCard,
  },
  {
    title: 'Results',
    url: ROUTES.RESULTS,
    icon: Award,
  },
  {
    title: 'Mock Tests',
    url: ROUTES.MOCK_TESTS,
    icon: FileText,
  },
  {
    title: 'Live Classes',
    url: ROUTES.LIVE_CLASSES,
    icon: Video,
  },
];
