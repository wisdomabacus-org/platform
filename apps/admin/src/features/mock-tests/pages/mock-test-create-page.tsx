import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';
import { useCreateMockTest } from '../hooks/use-mock-tests';
import { MockTestFormValues } from '../types/mock-test-schema';
import { PageHeader } from '@/shared/components/page-header';

export default function MockTestCreatePage() {
  const navigate = useNavigate();
  const { mutate: createMockTest, isPending } = useCreateMockTest();

  const handleSave = (values: MockTestFormValues) => {
    createMockTest(values, {
      onSuccess: (data: any) => {
        navigate(ROUTES.MOCK_TESTS_DETAIL.replace(':id', data.id));
      }
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Create Mock Test"
          description="Set up a new practice test for students."
        />
        <div className="mt-6">
          <MockTestForm
            onCancel={() => navigate(ROUTES.MOCK_TESTS)}
            onSave={handleSave}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
