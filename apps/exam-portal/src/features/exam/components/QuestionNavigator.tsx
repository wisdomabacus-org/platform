// src/features/exam/components/QuestionNavigator.tsx

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  markedQuestions: Set<number>;
  onQuestionSelect: (id: number) => void;
}

export const QuestionNavigator = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedQuestions,
  onQuestionSelect,
}: QuestionNavigatorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentButtonRef.current && scrollContainerRef.current) {
      const button = currentButtonRef.current;
      const container = scrollContainerRef.current;

      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Center the current question button
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentQuestion]);

  const getButtonVariant = (id: number) => {
    if (id === currentQuestion) {
      return answeredQuestions.has(id)
        ? "answered"
        : markedQuestions.has(id)
        ? "marked"
        : "default";
    }
    if (answeredQuestions.has(id)) return "answered";
    if (markedQuestions.has(id)) return "marked";
    return "outline";
  };

  return (
    // ✅ FIX: Added 'w-screen' here to match the footer fix
    <div className="sticky bottom-[56px] z-40 border-t bg-card/95 backdrop-blur-sm w-screen">
      <div
        ref={scrollContainerRef}
        className="flex gap-1.5 overflow-x-auto px-4 py-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ msOverflowStyle: "none" }}
      >
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((id) => (
          <Button
            key={id}
            ref={id === currentQuestion ? currentButtonRef : null}
            variant={getButtonVariant(id)}
            size="icon"
            onClick={() => onQuestionSelect(id)}
            className={cn(
              "h-9 w-9 flex-shrink-0 rounded-full snap-center text-xs font-semibold",
              id === currentQuestion && "ring-2 ring-offset-2 ring-offset-card"
            )}
          >
            {id}
          </Button>
        ))}
      </div>

      {/* Gradient fade indicators */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card/95 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/95 to-transparent" />
    </div>
  );
};
