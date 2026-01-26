// src/features/exam/components/QuestionContent.tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from "@/types/exam.types";

interface QuestionContentProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
}

export const QuestionContent = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionContentProps) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Question Header */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-primary">
            Question {currentQuestion} of {totalQuestions}
          </p>
          <p className="text-lg font-medium leading-relaxed">
            {question.questionText}
          </p>
          {question.imageUrl && (
            <div className="mt-4">
              <img
                src={question.imageUrl}
                alt={`Question ${currentQuestion}`}
                className="max-w-full rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer !== null ? String(selectedAnswer) : ""}
          onValueChange={(value) => onAnswerSelect(Number(value))}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <div
              key={option.index} // Use the option's own index if available and stable
              className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
            >
              <RadioGroupItem
                value={String(option.index)}
                id={`option-${option.index}`}
              />
              <Label
                htmlFor={`option-${option.index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {/* ✅ CORRECTED: Render the 'text' property of the option object */}
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </main>
  );
};
