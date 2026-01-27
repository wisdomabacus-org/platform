
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// We might fetch users and competitions inside or pass them as data
// For optimized performance on large sets, async select search is needed.
// For MVP, simplistic ID inputs or basic fetches can serve.

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { userId: string; competitionId: string; paymentId: string }) => void;
    isLoading: boolean;
}

export function CreateEnrollmentModal({ open, onOpenChange, onConfirm, isLoading }: Props) {
    const [userId, setUserId] = useState('');
    const [competitionId, setCompetitionId] = useState('');
    const [paymentId, setPaymentId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !competitionId) {
            toast.error('User and Competition are required');
            return;
        }
        onConfirm({ userId, competitionId, paymentId });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manual Enrollment</DialogTitle>
                    <DialogDescription>
                        Manually enroll a user into a competition.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId">User ID (Profile ID)</Label>
                        <Input
                            id="userId"
                            placeholder="e.g. 550e8400-e29b..."
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Copy ID from Users page (view details).
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="competitionId">Competition ID</Label>
                        <Input
                            id="competitionId"
                            placeholder="e.g. 123e4567-e89b..."
                            value={competitionId}
                            onChange={e => setCompetitionId(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Copy ID from Competitions page.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentId">Payment ID (Optional)</Label>
                        <Input
                            id="paymentId"
                            placeholder="Reference or leave blank for auto-generated"
                            value={paymentId}
                            onChange={e => setPaymentId(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enroll User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
