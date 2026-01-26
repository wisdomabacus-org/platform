import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { QuestionsHeader } from '../components/questions/questions-header';
import { QuestionsGrid } from '../components/questions/questions-grid';
import { QuestionForm } from '../components/questions/question-form';
import { useQuestionsStore } from '../store/questions.store';
import { ROUTES } from '@/config/constants';

const mockQuestions = [
  {
    _id: 'q1',
    questionText: 'What is 7 + 5?',
    options: [
      { _id: 'o1', text: '10' },
      { _id: 'o2', text: '11' },
      { _id: 'o3', text: '12' },
      { _id: 'o4', text: '13' },
    ],
    correctOptionId: 'o3',
  },
];

export default function CompetitionQuestionsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const {
    load,
    questions,
    activeId,
    isEditing,
    draft,
    setDraft,
    setActive,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    hasChanges,
    discardChanges,
  } = useQuestionsStore();

  useEffect(() => {
    load(mockQuestions);
  }, [load]);

  const onSaveAll = () => {
    // later: PATCH request
    navigate(ROUTES.COMPETITIONS);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-auto">
      <QuestionsHeader
        title="Question Bank"
        subtitle="Manage and edit all questions for this competition."
        meta={{
          totalQuestions: questions.length,
          gradeRange: '1–5',
          fee: '₹150',
          status: 'Draft',
        }}
        search={query}
        setSearch={setQuery}
        onImport={() => console.log('Import CSV')}
      />

      <div className="mx-auto w-full max-w-7xl p-6">
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-10 md:col-span-7">
            <QuestionsGrid
              items={questions}
              activeId={activeId}
              onSelect={setActive}
              onDelete={deleteQuestion}
              filterByNumber={query}
            />
          </div>

          <div className="col-span-10 md:col-span-3">
            <QuestionForm
              mode={isEditing ? 'edit' : 'create'}
              draft={draft}
              setDraft={setDraft}
              onAdd={addQuestion}
              onUpdate={updateQuestion}
              onCancelEdit={() => setActive(null)}
            />
          </div>
        </div>

        <div className="h-24" />
      </div>

      {hasChanges() && (
        <div className="bg-background sticky h-max right-0 bottom-0 left-0 z-10 border-t">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 p-4">
            <div className="text-muted-foreground text-sm">You have unsaved changes.</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={discardChanges}>
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
