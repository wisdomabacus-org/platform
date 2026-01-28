
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ActivityItem } from '../types/dashboard.types';

interface RecentActivityProps {
    activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="space-y-8">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-wrap items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.user}</p>
                            <p className="text-sm text-muted-foreground">{activity.title}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
            {activities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
            )}
        </div>
    );
}
