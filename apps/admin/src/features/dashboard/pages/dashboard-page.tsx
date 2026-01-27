
import { useDashboardData } from '../hooks/use-dashboard';
import { PageHeader } from '@/shared/components/page-header';
import { MetricCard } from '../components/metric-card';
import { RecentActivity } from '../components/recent-activity';
import { QuickActions } from '../components/quick-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Users, Trophy, DollarSign, Inbox } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { stats, recentActivity } = data || {
    stats: { totalUsers: 0, userGrowth: 0, activeCompetitions: 0, totalRevenue: 0, revenueGrowth: 0, pendingDemoRequests: 0 },
    recentActivity: []
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your platform's performance and activity."
      />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: stats.userGrowth, isPositive: true }}
          description="from last month"
        />
        <MetricCard
          title="Active Competitions"
          value={stats.activeCompetitions}
          icon={Trophy}
          description="currently live & open"
        />
        <MetricCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: stats.revenueGrowth, isPositive: true }}
          description="from last month"
        />
        <MetricCard
          title="Pending Requests"
          value={stats.pendingDemoRequests}
          icon={Inbox}
          description="require attention"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest enrollments and user actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentActivity} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions className="grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-xl" />
        <Skeleton className="col-span-3 h-[400px] rounded-xl" />
      </div>
    </div>
  )
}
