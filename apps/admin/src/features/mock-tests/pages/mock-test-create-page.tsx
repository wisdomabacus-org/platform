import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';
export default function MockTestCreatePage() {
  const navigate = useNavigate();

  return (
    <MockTestForm
      onCancel={() => navigate(ROUTES.MOCK_TESTS)}
      onSave={(values) => {
        // Later: POST /admin/mock-tests
        // const id = res.data.id
        console.log(values)
        const id = 'tmp-1';
        navigate(`/mock-tests/${id}/edit`); // or `/mock-tests/${id}/questions`
      }}
    />
  );
}
