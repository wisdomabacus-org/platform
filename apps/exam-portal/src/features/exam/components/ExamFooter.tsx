import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookmarkCheck } from "lucide-react";

interface ExamFooterProps {
  onMarkForReview: () => void;
  onPrevious: () => void;
  onSaveAndNext: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isMarked?: boolean;
  isMobile?: boolean;
}

export const ExamFooter = ({
  onMarkForReview,
  onPrevious,
  onSaveAndNext,
  canGoBack,
  canGoForward,
  isMarked = false,
  isMobile,
}: ExamFooterProps) => {
  return (
    <footer className="sticky w-screen md:w-full bottom-0 z-50 flex items-center justify-between border-t bg-card px-4 py-3 shadow-sm md:px-6">
      {isMobile ? (
        <div className="w-screen flex items-center justify-between">
          <Button
            variant={isMarked ? "default" : "outline"}
            size="sm"
            onClick={onMarkForReview}
            className={isMarked ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" : ""}
          >
            {isMarked ? (
              <>
                {/* @ts-ignore */}
                <BookmarkCheck className="mr-1 h-3.5 w-3.5" />
                Marked
              </>
            ) : (
              "Review"
            )}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onPrevious} disabled={!canGoBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="destructive-dark" size="icon" onClick={onSaveAndNext} disabled={!canGoForward}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between">
          <Button
            variant={isMarked ? "default" : "outline"}
            onClick={onMarkForReview}
            className={isMarked ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" : ""}
          >
            {isMarked ? (
              <>
                {/* @ts-ignore */}
                <BookmarkCheck className="mr-1.5 h-4 w-4" />
                Marked for Review
              </>
            ) : (
              "Mark for Review"
            )}
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onPrevious} disabled={!canGoBack}>
              Previous
            </Button>
            <Button variant="destructive-dark" onClick={onSaveAndNext} disabled={!canGoForward}>
              Save & Next
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
};
