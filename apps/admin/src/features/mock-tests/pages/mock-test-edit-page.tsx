import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { MockTestForm } from '../components/forms/mock-test-form';

// For now, mock load
const mockLoad = (id: string) => ({
  title: `Mock Test ${id}`,
  description: 'Practice set for Grade 3.',
  gradeLevel: 3,
  isFree: false,
  durationMinutes: 45,
  isPublished: false,
});

export default function MockTestEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<any>(null);

  useEffect(() => {
    if (id) setInitial(mockLoad(id));
  }, [id]);

  if (!initial) return null;

  return (
    <MockTestForm
      initial={initial}
      onCancel={() => navigate(ROUTES.MOCK_TESTS)}
      onSave={(values) => {
        // Later: PATCH /admin/mock-tests/:id
        console.log(values);
        // Optionally navigate to question bank: `/mock-tests/${id}/questions`
        navigate(ROUTES.MOCK_TESTS);
      }}
    />
  );
}
