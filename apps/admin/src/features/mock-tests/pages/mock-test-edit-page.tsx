import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';
import { useMockTest, useUpdateMockTest } from '../hooks/use-mock-tests';
import { MockTestFormValues } from '../types/mock-test-schema';
import { Loader2 } from 'lucide-react';

export default function MockTestEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: mockTest, isLoading: isLoadingTest } = useMockTest(id!);
  const { mutate: updateMockTest, isPending: isUpdating } = useUpdateMockTest();

  if (isLoadingTest) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!mockTest) {
    return <div>Mock Test not found</div>;
  }

  const handleSave = (values: MockTestFormValues) => {
    updateMockTest({ id: id!, data: values });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <MockTestForm
        initial={mockTest as any}
        onCancel={() => navigate(ROUTES.MOCK_TESTS)}
        onSave={handleSave}
        isLoading={isUpdating}
      />
    </div>
  );
}
