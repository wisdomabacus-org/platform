
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/use-users';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';

// Tabs will be imported here
import { UserProfileTab } from '../components/user-detail/profile-tab';
import { UserEnrollmentsTab } from '../components/user-detail/enrollments-tab';
import { UserActivityTab } from '../components/user-detail/activity-tab';

export default function UsersDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser(id!);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!user) return <div>User not found</div>;

    return (
        <div className="flex flex-col h-full space-y-6 pt-6 pb-12 px-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.USERS)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{user.studentName || 'Unknown Student'}</h2>
                    <p className="text-muted-foreground">{user.email || user.phone} • UID: {user.uid}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {/* Actions like Edit, Bans, etc */}
                    <Button variant="outline">Reset Password</Button>
                    <Button variant="destructive">Delete User</Button>
                </div>
            </div>

            <Separator />

            {/* Content Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="profile">
                        <UserProfileTab user={user} />
                    </TabsContent>
                    <TabsContent value="enrollments">
                        <UserEnrollmentsTab userId={user.id} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <UserActivityTab userId={user.id} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
