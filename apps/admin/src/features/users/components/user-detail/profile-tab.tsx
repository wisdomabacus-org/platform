
import { User } from '../../types/user.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface Props {
    user: User;
}

export function UserProfileTab({ user }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Student Name</div>
                        <div className="text-sm">{user.studentName || '—'}</div>

                        <div className="text-sm font-medium text-muted-foreground">Parent Name</div>
                        <div className="text-sm">{user.parentName || '—'}</div>

                        <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                        <div className="text-sm">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}</div>

                        <div className="text-sm font-medium text-muted-foreground">Grade</div>
                        <div className="text-sm">{user.studentGrade || '—'}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div className="text-sm">{user.email || '—'}
                            {user.emailVerified && <Badge variant="outline" className="ml-2">Verified</Badge>}
                        </div>

                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div className="text-sm">{user.phone || '—'}</div>

                        <div className="text-sm font-medium text-muted-foreground">School</div>
                        <div className="text-sm">{user.schoolName || '—'}</div>

                        <div className="text-sm font-medium text-muted-foreground">City/State</div>
                        <div className="text-sm">{user.city}, {user.state}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">UID</div>
                        <div className="text-sm font-mono">{user.uid}</div>

                        <div className="text-sm font-medium text-muted-foreground">Provider</div>
                        <div className="text-sm capitalize">{user.authProvider}</div>

                        <div className="text-sm font-medium text-muted-foreground">Created At</div>
                        <div className="text-sm">{user.createdAt.toLocaleString()}</div>

                        <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                        <div className="text-sm">{user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
