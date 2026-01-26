import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Menu } from "lucide-react";
import { formatTime } from "@/utils/timeFormatter";

interface ExamHeaderProps {
  timeLeft: number;
  onSubmit: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export const ExamHeader = memo(
  ({ timeLeft, onSubmit, onMenuClick, isMobile }: ExamHeaderProps) => {
    const timeString = formatTime(timeLeft);

    return (
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-card px-4 py-3 shadow-sm md:px-6">
        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-sm font-bold text-secondary">
              Wisdom Abacus
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Clock className="h-4 w-4" />
              <span>{timeString}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-x-2.5">
              <img
                src="/brand.png" // Assumes brand.png is in your /public folder
                alt="Wisdom Abacus"
                className="h-8 w-8 rounded-full object-cover"
              />
              <p className="text-lg font-bold text-foreground">Wisdom Abacus</p>
            </div>
            <div className="text-base font-semibold text-foreground">
              National Abacus Championship 2025
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                <span>Time Left: {timeString}</span>
              </div>
              <Button variant="destructive-dark" onClick={onSubmit}>
                Submit Test
              </Button>
            </div>
          </>
        )}
      </header>
    );
  }
);

ExamHeader.displayName = "ExamHeader";
