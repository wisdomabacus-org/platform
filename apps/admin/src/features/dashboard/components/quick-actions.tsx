
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Button } from '@/shared/components/ui/button';
import { Plus, Users, FileText } from 'lucide-react';

export function QuickActions({ className }: { className?: string }) {
    const navigate = useNavigate();

    return (
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
            <Button
                variant="outline"
                className="h-20 flex-col items-start justify-center gap-1 p-4"
                onClick={() => navigate(ROUTES.COMPETITIONS_CREATE)}
            >
                <span className="flex items-center gap-2 font-semibold">
                    <Plus className="h-4 w-4" />
                    Create Competition
                </span>
                <span className="text-xs text-muted-foreground">Start a new event</span>
            </Button>

            <Button
                variant="outline"
                className="h-20 flex-col items-start justify-center gap-1 p-4"
                onClick={() => navigate(ROUTES.USERS)} // Or bulk upload route if exists
            >
                <span className="flex items-center gap-2 font-semibold">
                    <Users className="h-4 w-4" />
                    Manage Users
                </span>
                <span className="text-xs text-muted-foreground">View directory</span>
            </Button>

            <Button
                variant="outline"
                className="h-20 flex-col items-start justify-center gap-1 p-4"
                onClick={() => navigate(ROUTES.MOCK_TESTS_CREATE)}
            >
                <span className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    New Mock Test
                </span>
                <span className="text-xs text-muted-foreground">Add practice content</span>
            </Button>
        </div>
    );
}
