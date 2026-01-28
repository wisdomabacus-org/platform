
import {
    LayoutDashboard,
    Users,
    Trophy,
    Receipt,
    CreditCard,
    FileText,
    Inbox,
    UserPlus,
    BookOpen
} from 'lucide-react';
import { ROUTES } from '@/config/constants';

export interface NavItem {
    title: string;
    url: string;
    icon: any;
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            {
                title: 'Dashboard',
                url: ROUTES.DASHBOARD,
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: 'Content',
        items: [
            {
                title: 'Competitions',
                url: ROUTES.COMPETITIONS,
                icon: Trophy,
            },
            {
                title: 'Mock Tests',
                url: ROUTES.MOCK_TESTS,
                icon: FileText,
            },
            {
                title: 'Question Banks',
                url: ROUTES.QUESTION_BANKS,
                icon: BookOpen,
            },
        ],
    },
    {
        label: 'Users',
        items: [
            {
                title: 'Users',
                url: ROUTES.USERS,
                icon: Users,
            },
            {
                title: 'Enrollments',
                url: ROUTES.ENROLLMENTS,
                icon: Receipt,
            },
            {
                title: 'Referrals',
                url: ROUTES.REFERRALS,
                icon: UserPlus,
            },
        ],
    },

    {
        label: 'Finance',
        items: [
            {
                title: 'Payments',
                url: ROUTES.PAYMENTS,
                icon: CreditCard,
            },
        ],
    },
    {
        label: 'CRM',
        items: [
            {
                title: 'Requests',
                url: ROUTES.REQUESTS,
                icon: Inbox,
            },
        ],
    },
];
