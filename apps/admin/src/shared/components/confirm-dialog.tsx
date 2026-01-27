
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"

interface ConfirmDialogProps {
    children: React.ReactNode
    title?: string
    description?: string
    onConfirm: () => void
    disabled?: boolean
    confirmText?: string
    variant?: "default" | "destructive"
}

export function ConfirmDialog({
    children,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    onConfirm,
    disabled,
    confirmText = "Continue",
    variant = "default",
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild disabled={disabled}>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevent closing immediately if inside a form, though onConfirm usually handles logic.
                            // Actually shadcn AlertDialogAction closes automatically.
                            onConfirm();
                        }}
                        className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
