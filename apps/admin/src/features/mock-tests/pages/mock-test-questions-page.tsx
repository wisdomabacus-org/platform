import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockQHeader } from '../components/questions/header';
import { MockQGrid } from '../components/questions/grid';
import { MockQForm } from '../components/questions/question-form';
import { useMockQStore } from '../store/mock-questions.store';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/config/constants';

// Mock load
const mockQuestions = [
  {
    _id: 'q1',
    questionText: '2 + 5 = ?',
    options: [
      { _id: 'o1', text: '6' },
      { _id: 'o2', text: '7' },
      { _id: 'o3', text: '8' },
      { _id: 'o4', text: '9' },
    ],
    correctOptionId: 'o2',
  },
];

export default function MockTestQuestionsPage() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();

  const {
    load,
    questions,
    activeId,
    isEditing,
    draft,
    setDraft,
    setActive,
    newDraft,
    add,
    update,
    remove,
    hasChanges,
    discard,
  } = useMockQStore();

  useEffect(() => {
    load(mockQuestions);
  }, [load]);

  const onSaveAll = () => {
    // Later: PATCH /admin/mock-tests/:id/questions
    navigate(ROUTES.MOCK_TESTS);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-y-auto">
      <MockQHeader total={questions.length} />

      <div className="mx-auto w-full max-w-7xl p-6">
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-10 md:col-span-7">
            <MockQGrid
              items={questions}
              activeId={activeId}
              onSelect={setActive}
              onDelete={remove}
              onNew={newDraft}
            />
          </div>

          <div className="col-span-10 md:col-span-3">
            <MockQForm
              mode={isEditing ? 'edit' : 'create'}
              draft={draft}
              setDraft={setDraft}
              onAdd={add}
              onUpdate={update}
              onCancelEdit={() => setActive(null)}
            />
          </div>
        </div>

        <div className="h-24" />
      </div>

      {hasChanges() && (
        <div className="bg-background sticky right-0 bottom-0 left-0 z-10 border-t">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
            <div className="text-muted-foreground text-sm">You have unsaved changes.</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={discard}>
                Discard
              </Button>
              <Button onClick={onSaveAll}>Save Question Bank</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
