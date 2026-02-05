import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExamLegend } from "./ExamLegend";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestion: number;
  // Accept Set of question numbers that are answered
  answeredQuestions: Set<number>;
  markedQuestions: Set<number>;
  onQuestionSelect: (questionId: number) => void;
  isCompact?: boolean;
}

export const QuestionPalette = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedQuestions,
  onQuestionSelect,
  isCompact = false,
}: QuestionPaletteProps) => {

  const isAnswered = (id: number) => answeredQuestions?.has(id) ?? false;
  const isMarked = (id: number) => markedQuestions?.has(id) ?? false;

  const getButtonVariant = (id: number) => {
    if (id === currentQuestion) return "default";
    if (isMarked(id)) return "marked";
    if (isAnswered(id)) return "answered";
    return "outline";
  };

  return (
    <div className="flex h-full flex-col">
      {!isCompact && (
        <div className="border-b p-4">
          <h4 className="font-semibold text-secondary">Questions</h4>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((id) => (
            <Button
              key={id}
              variant={getButtonVariant(id)}
              onClick={() => onQuestionSelect(id)}
              className={cn(
                "relative",
                id === currentQuestion && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {id}
            </Button>
          ))}
        </div>
      </div>

      {!isCompact && (
        <div className="border-t p-4">
          <ExamLegend />
        </div>
      )}
    </div>
  );
};
