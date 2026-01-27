
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface Props {
    userId: string;
}

export function UserActivityTab({ userId }: Props) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Detailed user activity (logins, updates) will appear here.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Payment transactions will appear here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
