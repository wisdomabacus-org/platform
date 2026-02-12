import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockTest, useUpdateMockTest } from '../hooks/use-mock-tests';
import { useMockTestAttempts, useMockTestAttemptStats, useDeleteMockTestAttempt } from '../hooks/use-mock-test-attempts';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import {
    Edit,
    FileText,
    Users,
    Clock,
    FileQuestion,
    Eye,
    EyeOff,
    Loader2,
    Award,
    BookOpen,
    BarChart3,
    Lock,
    Unlock,
    Trash2,
} from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AssignQuestionBankModal } from '../components/assign-question-bank-modal';
import { AttemptsTable } from '../components/attempts-table';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import type { MockTestAttempt } from '../api/mock-test-attempts.service';

// Difficulty badge configuration
const DIFFICULTY_CONFIG: Record<string, { color: string; bgColor: string }> = {
    Beginner: { color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    Intermediate: { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    Advanced: { color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    Expert: { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

function DetailSkeleton() {
    return (
        <div className="space-y-6 px-4 py-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[90px] rounded-md" />
                ))}
            </div>
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

export default function MockTestDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: mockTest, isLoading } = useMockTest(id!);
    const { mutate: updateMockTest, isPending: isUpdating } = useUpdateMockTest();
    const [questionBankModalOpen, setQuestionBankModalOpen] = useState(false);
    const [attemptsPage, setAttemptsPage] = useState(0);
    const { confirm, DialogComponent } = useConfirmationDialog();
    
    // Fetch attempts data
    const { data: attemptsData, isLoading: isLoadingAttempts } = useMockTestAttempts(id!, {
        page: attemptsPage,
        limit: 20,
    });
    
    // Fetch attempt statistics
    const { data: attemptStats } = useMockTestAttemptStats(id!);
    
    // Delete attempt mutation
    const { mutate: deleteAttempt } = useDeleteMockTestAttempt();

    const handlePublish = () => {
        if (!mockTest) return;
        updateMockTest({
            id: id!,
            data: { is_published: !mockTest.is_published },
        });
    };
    
    const handleDeleteAttempt = (attempt: MockTestAttempt) => {
        confirm({
            title: 'Delete Attempt Record?',
            description: `Are you sure you want to delete this attempt by ${attempt.userName}? This action cannot be undone and will permanently remove the student's test results.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'destructive',
            onConfirm: async () => {
                deleteAttempt({ id: attempt.id, mockTestId: id! });
            },
        });
    };

    if (isLoading) {
        return <DetailSkeleton />;
    }

    if (!mockTest) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-destructive/10">
                    <FileText className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">Mock Test Not Found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    The mock test you're looking for doesn't exist or has been deleted.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.MOCK_TESTS)} className="mt-4">
                    Back to Mock Tests
                </Button>
            </div>
        );
    }

    const difficultyConfig = DIFFICULTY_CONFIG[mockTest.difficulty] || DIFFICULTY_CONFIG.Beginner;

    return (
        <div className="space-y-6 px-4 py-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mockTest.title}
                        </h1>
                        <Badge
                            variant="secondary"
                            className={cn(
                                'text-xs font-medium',
                                difficultyConfig.color,
                                difficultyConfig.bgColor
                            )}
                        >
                            {mockTest.difficulty}
                        </Badge>
                        <Badge variant={mockTest.is_published ? 'default' : 'outline'}>
                            {mockTest.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        {mockTest.is_locked && (
                            <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <Lock className="h-3 w-3" />
                                Paid
                            </Badge>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Grades {mockTest.min_grade}-{mockTest.max_grade} •{' '}
                        Created {format(new Date(mockTest.created_at), 'MMM d, yyyy')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.MOCK_TESTS_EDIT.replace(':id', id!))}
                        className="gap-1.5"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button size="sm" onClick={handlePublish} disabled={isUpdating} className="gap-1.5">
                        {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : mockTest.is_published ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        {mockTest.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Attempts"
                    value={mockTest.attempt_count || 0}
                    icon={Users}
                    description="Students attempted"
                    iconColor="bg-blue-500/10 text-blue-500"
                />
                <StatCard
                    title="Questions"
                    value={mockTest.total_questions || 0}
                    icon={FileQuestion}
                    description="Total questions"
                    iconColor="bg-emerald-500/10 text-emerald-500"
                />
                <StatCard
                    title="Duration"
                    value={`${mockTest.duration || 0} mins`}
                    icon={Clock}
                    description="Time limit"
                    iconColor="bg-orange-500/10 text-orange-500"
                />
                <StatCard
                    title="Access"
                    value={mockTest.is_locked ? 'Paid' : 'Free'}
                    icon={mockTest.is_locked ? Lock : Unlock}
                    description={mockTest.is_active ? 'Active' : 'Inactive'}
                    iconColor={mockTest.is_locked ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'}
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
                    <TabsTrigger value="analytics" className="gap-1.5 rounded px-3 text-sm">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                    {/* Description */}
                    <div className="rounded-md border p-4">
                        <h4 className="mb-2 text-sm font-semibold">Description</h4>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {mockTest.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Details */}
                        <div className="rounded-md border p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">Details</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Grade Range</span>
                                    <span>Grade {mockTest.min_grade} - {mockTest.max_grade}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Difficulty</span>
                                    <span className="font-medium">{mockTest.difficulty}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Sort Order</span>
                                    <span>{mockTest.sort_order || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="rounded-md border p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">Settings</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={mockTest.is_active ? 'default' : 'secondary'} className="text-xs">
                                        {mockTest.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Access Type</span>
                                    <Badge variant="outline" className="text-xs">
                                        {mockTest.is_locked ? 'Paid' : 'Free'}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span className="text-xs">
                                        {format(new Date(mockTest.updated_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-md border p-4">
                        <h4 className="mb-1 text-sm font-semibold">Quick Actions</h4>
                        <p className="mb-3 text-xs text-muted-foreground">Common tasks for this mock test</p>
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
                                View Attempts
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <BarChart3 className="h-3.5 w-3.5" />
                                View Analytics
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="participants" className="mt-4">
                    <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold">Test Attempts</h3>
                                <p className="text-sm text-muted-foreground">
                                    {attemptStats?.totalAttempts || mockTest.attempt_count || 0} students have attempted this mock test
                                </p>
                            </div>
                            {attemptStats && attemptStats.totalAttempts > 0 && (
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="text-right">
                                        <p className="text-muted-foreground">Average Score</p>
                                        <p className="font-semibold">{attemptStats.averagePercentage}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground">Highest</p>
                                        <p className="font-semibold text-emerald-600">{attemptStats.highestScore}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(attemptStats?.totalAttempts || mockTest.attempt_count || 0) === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Users className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-3 text-sm text-muted-foreground">No attempts yet</p>
                            </div>
                        ) : (
                            <AttemptsTable
                                data={attemptsData?.data || []}
                                total={attemptsData?.total || 0}
                                page={attemptsPage}
                                limit={20}
                                onPageChange={setAttemptsPage}
                                onDelete={handleDeleteAttempt}
                                isLoading={isLoadingAttempts}
                            />
                        )}
                    </div>
                    <DialogComponent />
                </TabsContent>

                <TabsContent value="questions" className="mt-4">
                    <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold">Question Banks</h3>
                                <p className="text-sm text-muted-foreground">
                                    Assign pre-built question banks to this mock test
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setQuestionBankModalOpen(true)}
                            >
                                Assign Question Banks
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4">
                            <p><strong>How it works:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Click "Assign Question Banks" to select question banks</li>
                                <li>Question banks contain pre-generated abacus questions by grade level</li>
                                <li>Selected question banks will be used during the test</li>
                            </ul>
                        </div>
                    </div>

                    {/* Question Bank Assignment Modal */}
                    <AssignQuestionBankModal
                        mockTestId={id!}
                        open={questionBankModalOpen}
                        onOpenChange={setQuestionBankModalOpen}
                    />
                </TabsContent>

                <TabsContent value="analytics" className="mt-4">
                    <div className="rounded-md border p-4">
                        <h3 className="text-base font-semibold mb-4">Test Analytics</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="bg-muted/50 rounded-md p-4 text-center">
                                <p className="text-2xl font-bold text-primary">{mockTest.attempt_count || 0}</p>
                                <p className="text-xs text-muted-foreground">Total Attempts</p>
                            </div>
                            <div className="bg-muted/50 rounded-md p-4 text-center">
                                <p className="text-2xl font-bold text-emerald-600">{mockTest.total_questions || 0}</p>
                                <p className="text-xs text-muted-foreground">Questions</p>
                            </div>
                            <div className="bg-muted/50 rounded-md p-4 text-center">
                                <p className="text-2xl font-bold text-orange-600">{mockTest.duration || 0}m</p>
                                <p className="text-xs text-muted-foreground">Duration</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">Detailed analytics (completion rates, average scores) will be available once students start attempting the test.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
