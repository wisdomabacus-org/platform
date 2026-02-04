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

/**
 * Parse question text to extract operands for vertical display
 * Formats like: "2 + 3 + 4" or "9 - 3 - 2" or "15 + 23 - 12"
 */
function parseQuestionForVerticalDisplay(questionText: string): {
  operands: { value: number; isNegative: boolean }[];
  isStackable: boolean;
} {
  // Check if the question contains + or - signs (abacus-style operations)
  if (!questionText.match(/[\+\-]/)) {
    return { operands: [], isStackable: false };
  }

  try {
    // Split by + and - while keeping the operators
    const parts: { value: number; isNegative: boolean }[] = [];

    // Replace - with +- for easier splitting
    const normalized = questionText.replace(/\s*-\s*/g, " + -").replace(/\s+/g, " ");
    const tokens = normalized.split(/\s*\+\s*/).filter(t => t.trim());

    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;

      const isNegative = trimmed.startsWith("-");
      const numStr = isNegative ? trimmed.slice(1).trim() : trimmed;
      const value = parseInt(numStr, 10);

      if (!isNaN(value)) {
        parts.push({ value, isNegative });
      }
    }

    return { operands: parts, isStackable: parts.length >= 2 };
  } catch {
    return { operands: [], isStackable: false };
  }
}

export const QuestionContent = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionContentProps) => {
  const { operands, isStackable } = parseQuestionForVerticalDisplay(question.questionText);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Question Header */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-primary">
            Question {currentQuestion} of {totalQuestions}
          </p>

          {/* Display question content */}
          {isStackable && operands.length > 0 ? (
            // Vertical stacked display for abacus-style questions
            <div className="flex flex-col items-center py-6">
              <div className="text-sm text-muted-foreground mb-4">
                Calculate the following:
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 min-w-[180px]">
                {/* Q Number Badge */}
                <div className="text-center mb-4">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    Q{currentQuestion}
                  </span>
                </div>

                {/* Stacked Numbers */}
                <div className="flex flex-col items-end space-y-2 font-mono text-2xl font-bold">
                  {operands.map((op, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-end gap-2 min-w-[100px]"
                    >
                      {/* Show sign for negative numbers (after the first) */}
                      {idx > 0 && (
                        <span className={`text-lg ${op.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                          {op.isNegative ? '−' : '+'}
                        </span>
                      )}
                      <span className="tabular-nums">
                        {op.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Answer Line */}
                <div className="mt-4 pt-4 border-t-2 border-slate-300 dark:border-slate-600">
                  <div className="text-center text-base text-muted-foreground">
                    = ?
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Standard text display for non-abacus questions
            <p className="text-lg font-medium leading-relaxed">
              {question.questionText}
            </p>
          )}

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
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.index}
              className="flex items-center space-x-3 rounded-xl border-2 p-4 transition-all hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer"
            >
              <RadioGroupItem
                value={String(option.index)}
                id={`option-${option.index}`}
              />
              <Label
                htmlFor={`option-${option.index}`}
                className="flex-1 cursor-pointer text-base font-medium"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </main>
  );
};
