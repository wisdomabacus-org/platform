
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { useMockTest, useMockTestQuestionBanks, useAssignMockTestQuestionBanks } from '../hooks/use-mock-tests';
import { useQuestionBanks } from '@/features/question-banks/hooks/use-question-banks';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';

interface Assignment {
  question_bank_id: string;
  grades: number[];
}

export default function MockTestQuestionsPage() {
  const { id: mockTestIdParam } = useParams<{ id: string }>();
  const { data: mockTest, isLoading: isLoadingTest } = useMockTest(mockTestIdParam!);
  const { data: assignedBanks, isLoading: isLoadingAssigned } = useMockTestQuestionBanks(mockTestIdParam!);
  const { data: allBanks, isLoading: isLoadingAllBanks } = useQuestionBanks();
  const { mutate: assignBanks, isPending: isSaving } = useAssignMockTestQuestionBanks();

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (assignedBanks) {
      setAssignments(assignedBanks.map((ab: any) => ({
        question_bank_id: ab.question_bank_id,
        grades: ab.grades || []
      })));
    }
  }, [assignedBanks]);

  const handleAddAssignment = () => {
    setAssignments([...assignments, { question_bank_id: '', grades: [] }]);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleUpdateAssignment = (index: number, field: keyof Assignment, value: any) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setAssignments(newAssignments);
  };

  const handleGradeToggle = (index: number, grade: number) => {
    const newAssignments = [...assignments];
    const currentGrades = newAssignments[index].grades;
    if (currentGrades.includes(grade)) {
      newAssignments[index].grades = currentGrades.filter(g => g !== grade);
    } else {
      newAssignments[index].grades = [...currentGrades, grade].sort((a, b) => a - b);
    }
    setAssignments(newAssignments);
  };

  const handleSave = () => {
    const validAssignments = assignments.filter(a => a.question_bank_id !== '');
    assignBanks({ id: mockTestIdParam!, assignments: validAssignments });
  };

  if (isLoadingTest || isLoadingAssigned || isLoadingAllBanks) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const availableBanks = allBanks?.data || [];
  const grades = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <PageHeader
        title={`Question Banks - ${mockTest?.title}`}
        description="Assign question banks and grades for this mock test."
      >
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Assignments
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assigned Question Banks</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddAssignment}>
              <Plus className="mr-2 h-4 w-4" /> Add Question Bank
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {assignments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                No question banks assigned yet.
              </div>
            ) : (
              assignments.map((assignment, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 border rounded-lg relative bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => handleRemoveAssignment(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Question Bank</label>
                      <Select
                        value={assignment.question_bank_id}
                        onValueChange={(val) => handleUpdateAssignment(index, 'question_bank_id', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a bank..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBanks.map((bank: any) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.title} {bank.tags && bank.tags.length > 0 ? `(${bank.tags.join(', ')})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Applicable Grades</label>
                    <div className="flex flex-wrap gap-2">
                      {grades.map(grade => (
                        <Badge
                          key={grade}
                          variant={assignment.grades.includes(grade) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-1"
                          onClick={() => handleGradeToggle(index, grade)}
                        >
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
