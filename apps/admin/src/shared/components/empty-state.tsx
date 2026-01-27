
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 min-h-[400px]">
            {Icon && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-6">
                {description}
            </p>
            {action}
        </div>
    )
}
