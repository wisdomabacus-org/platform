
import { useAdminProfile } from '../hooks/use-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2, User, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';

export function AdminProfileCard() {
    const { data: profile, isLoading } = useAdminProfile();

    if (isLoading) {
        return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (!profile) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Your account information and access details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-sm text-muted-foreground">{profile.username}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Role</p>
                        <Badge variant="secondary">{profile.role}</Badge>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">
                            {format(profile.lastLogin, 'PPpp')}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
