
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Plus, Users, FileText, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility

export function QuickActions({ className }: { className?: string }) {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Create Competition',
            description: 'Start a new event',
            icon: Plus,
            route: ROUTES.COMPETITIONS_CREATE,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            title: 'Manage Users',
            description: 'View directory',
            icon: Users,
            route: ROUTES.USERS,
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'New Mock Test',
            description: 'Add practice content',
            icon: FileText,
            route: ROUTES.MOCK_TESTS_CREATE,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
            title: 'View Payments',
            description: 'Check revenue',
            icon: CreditCard,
            route: ROUTES.PAYMENTS,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
    ];

    return (
        <div className={cn("grid gap-4 md:grid-cols-2", className)}>
            {actions.map((action) => (
                <button
                    key={action.title}
                    onClick={() => navigate(action.route)}
                    className="flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
                >
                    <div className={cn("flex size-10 items-center justify-center rounded-lg", action.bgColor)}>
                        <action.icon className={cn("size-5", action.color)} />
                    </div>
                    <div className="grid gap-1">
                        <span className="font-semibold leading-none tracking-tight">
                            {action.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {action.description}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}
