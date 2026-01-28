import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';
import { useMockTest, useUpdateMockTest } from '../hooks/use-mock-tests';
import { MockTestFormValues } from '../types/mock-test-schema';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { FileText } from 'lucide-react';

function EditPageSkeleton() {
  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[180px] rounded-md" />
          <Skeleton className="h-[120px] rounded-md" />
          <Skeleton className="h-[160px] rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function MockTestEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: mockTest, isLoading: isLoadingTest } = useMockTest(id!);
  const { mutate: updateMockTest, isPending: isUpdating } = useUpdateMockTest();

  if (isLoadingTest) {
    return <EditPageSkeleton />;
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

  const handleSave = (values: MockTestFormValues) => {
    updateMockTest({ id: id!, data: values }, {
      onSuccess: () => {
        navigate(ROUTES.MOCK_TESTS_DETAIL.replace(':id', id!));
      }
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Edit Mock Test"
          description={mockTest.title}
        />
        <div className="mt-6">
          <MockTestForm
            initial={mockTest as any}
            onCancel={() => navigate(ROUTES.MOCK_TESTS_DETAIL.replace(':id', id!))}
            onSave={handleSave}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}
