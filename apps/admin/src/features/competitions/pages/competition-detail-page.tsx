import { useParams, useNavigate } from 'react-router-dom';
import { useCompetition, useUpdateCompetition } from '../hooks/use-competitions';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import { format } from 'date-fns';
import {
    Edit,
    Trophy,
    Users,
    IndianRupee,
    Calendar,
    Clock,
    FileQuestion,
    Send,
    Eye,
    EyeOff,
    Loader2,
    Award,
    BookOpen,
    BarChart3,
} from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';

// Status badge configuration
const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bgColor: string }
> = {
    draft: { label: 'Draft', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800' },
    published: { label: 'Published', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    open: { label: 'Open', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    live: { label: 'Live', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    upcoming: { label: 'Upcoming', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    ongoing: { label: 'Ongoing', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    completed: { label: 'Completed', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    closed: { label: 'Closed', color: 'text-zinc-600', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
    archived: { label: 'Archived', color: 'text-zinc-500', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
};

function DetailSkeleton() {
    return (
        <div className="space-y-6 px-4 py-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[90px] rounded-md" />
                ))}
            </div>

            {/* Tabs Skeleton */}
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-[250px] rounded-md" />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
    iconColor,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    iconColor?: string;
}) {
    return (
        <div className="rounded-md border p-4">
            <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                <div
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md',
                        iconColor || 'bg-primary/10 text-primary'
                    )}
                >
                    <Icon className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}

export default function CompetitionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: competition, isLoading } = useCompetition(id!);
    const { mutate: updateCompetition, isPending: isUpdating } = useUpdateCompetition();

    const handlePublish = () => {
        if (!competition) return;
        const newStatus = competition.status === 'published' || competition.status === 'open' ? 'draft' : 'published';
        updateCompetition({
            id: id!,
            data: { status: newStatus },
        });
    };

    if (isLoading) {
        return <DetailSkeleton />;
    }

    if (!competition) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-destructive/10">
                    <Trophy className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">Competition Not Found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    The competition you're looking for doesn't exist or has been deleted.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.COMPETITIONS)} className="mt-4">
                    Back to Competitions
                </Button>
            </div>
        );
    }

    const status = competition.status || 'draft';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
    const isPublished = status === 'published' || status === 'open' || status === 'live';
    const estimatedRevenue = (competition.enrolled_count || 0) * (competition.enrollment_fee || 0);

    return (
        <div className="space-y-6 px-4 py-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {competition.title}
                        </h1>
                        <Badge
                            variant="secondary"
                            className={cn(
                                'text-xs font-medium',
                                statusConfig.color,
                                statusConfig.bgColor
                            )}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {competition.season} Season •{' '}
                        {competition.exam_date
                            ? format(new Date(competition.exam_date), 'EEEE, MMMM d, yyyy')
                            : 'No exam date set'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.COMPETITIONS_EDIT.replace(':id', id!))}
                        className="gap-1.5"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button size="sm" onClick={handlePublish} disabled={isUpdating} className="gap-1.5">
                        {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isPublished ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        {isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Enrollments"
                    value={competition.enrolled_count || 0}
                    icon={Users}
                    description="Students registered"
                    iconColor="bg-blue-500/10 text-blue-500"
                />
                <StatCard
                    title="Estimated Revenue"
                    value={`₹${estimatedRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    description={`Fee: ₹${competition.enrollment_fee || 0}`}
                    iconColor="bg-emerald-500/10 text-emerald-500"
                />
                <StatCard
                    title="Duration"
                    value={`${competition.duration || 0} mins`}
                    icon={Clock}
                    description={`${competition.total_questions || 0} questions`}
                    iconColor="bg-orange-500/10 text-orange-500"
                />
                <StatCard
                    title="Total Marks"
                    value={competition.total_marks || 0}
                    icon={Award}
                    description={`Grades ${competition.min_grade || 1}-${competition.max_grade || 12}`}
                    iconColor="bg-purple-500/10 text-purple-500"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="inline-flex h-9 gap-1 rounded-md bg-muted p-1">
                    <TabsTrigger value="overview" className="gap-1.5 rounded px-3 text-sm">
                        <BookOpen className="h-3.5 w-3.5" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="gap-1.5 rounded px-3 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        Participants
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="gap-1.5 rounded px-3 text-sm">
                        <FileQuestion className="h-3.5 w-3.5" />
                        Questions
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="gap-1.5 rounded px-3 text-sm">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Leaderboard
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                    {/* Description */}
                    <div className="rounded-md border p-4">
                        <h4 className="mb-2 text-sm font-semibold">Description</h4>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {competition.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Schedule */}
                        <div className="rounded-md border p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">Schedule</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Registration Opens</span>
                                    <span>
                                        {competition.registration_start_date
                                            ? format(new Date(competition.registration_start_date), 'MMM d, yyyy')
                                            : 'Not set'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Registration Closes</span>
                                    <span>
                                        {competition.registration_end_date
                                            ? format(new Date(competition.registration_end_date), 'MMM d, yyyy')
                                            : 'Not set'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Exam Date</span>
                                    <span className="font-medium">
                                        {competition.exam_date
                                            ? format(new Date(competition.exam_date), 'MMM d, yyyy')
                                            : 'Not set'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="rounded-md border p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">Configuration</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Duration</span>
                                    <span>{competition.duration || 0} minutes</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total Marks</span>
                                    <span>{competition.total_marks || 0}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Entry Fee</span>
                                    <span className="font-medium">
                                        {competition.enrollment_fee
                                            ? `₹${competition.enrollment_fee}`
                                            : 'Free'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-md border p-4">
                        <h4 className="mb-1 text-sm font-semibold">Quick Actions</h4>
                        <p className="mb-3 text-xs text-muted-foreground">Common tasks for this competition</p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => navigate(ROUTES.QUESTION_BANKS)}
                            >
                                <FileQuestion className="h-3.5 w-3.5" />
                                Assign Question Banks
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                View Enrollments
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Send className="h-3.5 w-3.5" />
                                Send Notifications
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="participants" className="mt-4">
                    <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold">Enrolled Participants</h3>
                                <p className="text-sm text-muted-foreground">
                                    {competition.enrolled_count || 0} students enrolled in this competition
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`${ROUTES.ENROLLMENTS}?competition=${id}`)}
                            >
                                View All Enrollments
                            </Button>
                        </div>
                        {(competition.enrolled_count || 0) === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Users className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-3 text-sm text-muted-foreground">No participants yet</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Click 'View All Enrollments' to see the full participant list.</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-4">
                    <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold">Question Banks</h3>
                                <p className="text-sm text-muted-foreground">
                                    Assign pre-built question banks to this competition
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => navigate(ROUTES.QUESTION_BANKS)}
                            >
                                Assign Question Banks
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4">
                            <p><strong>How it works:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Go to Question Banks to create or select existing banks</li>
                                <li>Question banks contain pre-generated abacus questions by grade level</li>
                                <li>Link question banks to this competition for the exam</li>
                            </ul>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-4">
                    <div className="flex flex-col items-center justify-center rounded-md border py-14 text-center">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-3 text-base font-semibold">Competition Leaderboard</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View rankings and results after the competition ends.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                            Coming Soon
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
