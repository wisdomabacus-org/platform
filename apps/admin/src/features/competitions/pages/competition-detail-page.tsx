
import { useParams, useNavigate } from 'react-router-dom';
import { useCompetition, useUpdateCompetition } from '../hooks/use-competitions';

import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, Edit, Trophy, Users, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/config/constants';

export default function CompetitionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: competition, isLoading } = useCompetition(id!);
    const { mutate: updateCompetition, isPending: isUpdating } = useUpdateCompetition();

    const handlePublish = () => {
        if (!competition) return;
        updateCompetition({
            id: id!,
            data: { status: competition.status === 'published' ? 'draft' : 'published' }
        });
    };

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (!competition) {
        return <div className="p-6">Competition not found</div>;
    }

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'draft': return 'bg-gray-500';
            case 'completed': return 'bg-blue-500';
            case 'archived': return 'bg-slate-800';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold tracking-tight">{competition.title}</h2>
                        <Badge className={getStatusColor(competition.status)}>{competition.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        {competition.season} • {format(new Date(competition.exam_date), 'PPP')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(ROUTES.COMPETITIONS_EDIT.replace(':id', id!))}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button onClick={handlePublish} disabled={isUpdating}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {competition.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{competition.enrolled_count || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Students registered
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <span className="text-muted-foreground font-bold">₹</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(competition.enrolled_count || 0) * (competition.enrollment_fee || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                            Estimated revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exam Status</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{competition.status || 'Draft'}</div>
                        <p className="text-xs text-muted-foreground">
                            Current phase
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Questions</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{competition.total_questions || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total questions
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="participants">Participants</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {competition.description || 'No description provided.'}
                            </p>
                        </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Registration Start:</span>
                                    <span className="text-sm text-muted-foreground">{format(new Date(competition.registration_start_date), 'PPP')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Registration End:</span>
                                    <span className="text-sm text-muted-foreground">{format(new Date(competition.registration_end_date), 'PPP')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Exam Date:</span>
                                    <span className="text-sm text-muted-foreground">{format(new Date(competition.exam_date), 'PPP')}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Duration:</span>
                                    <span className="text-sm text-muted-foreground">{competition.duration} mins</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Total Marks:</span>
                                    <span className="text-sm text-muted-foreground">{competition.total_marks}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Fee:</span>
                                    <span className="text-sm text-muted-foreground">₹{competition.enrollment_fee}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="participants">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center text-muted-foreground">Participants list coming soon.</div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="questions">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center text-muted-foreground">Question management coming soon.</div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="leaderboard">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center text-muted-foreground">Leaderboard logic coming soon.</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
