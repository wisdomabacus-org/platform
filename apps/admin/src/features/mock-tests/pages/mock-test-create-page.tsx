import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';
import { useCreateMockTest } from '../hooks/use-mock-tests';
import { MockTestFormValues } from '../types/mock-test-schema';

export default function MockTestCreatePage() {
  const navigate = useNavigate();
  const { mutate: createMockTest, isPending } = useCreateMockTest();

  const handleSave = (values: MockTestFormValues) => {
    createMockTest(values, {
      onSuccess: (data: any) => {
        // Navigate to edit page or questions page
        navigate(ROUTES.MOCK_TESTS_EDIT.replace(':id', data.id));
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <MockTestForm
        onCancel={() => navigate(ROUTES.MOCK_TESTS)}
        onSave={handleSave}
        isLoading={isPending}
      />
    </div>
  );
}
