import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  markedCount: number;
}

export const SubmitDialog = ({
  open,
  onOpenChange,
  onConfirm,
  answeredCount,
  totalQuestions,
  markedCount,
}: SubmitDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Test?</AlertDialogTitle>
          <AlertDialogDescription>
            You have answered {answeredCount} out of {totalQuestions} questions.
            {markedCount > 0 &&
              ` ${markedCount} questions are marked for review.`}
            <br />
            <br />
            Are you sure you want to submit your test? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Review Answers</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Submit Final Answers
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
