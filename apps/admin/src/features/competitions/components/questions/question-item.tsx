import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  index: number;
  active: boolean;
  text: string;
  onClick: () => void;
  onDelete: () => void;
}

export function QuestionItem({ index, active, text, onClick, onDelete }: Props) {
  return (
    <Card
      className={cn(
        'relative cursor-pointer border transition-colors',
        active ? 'border-primary' : 'hover:border-muted-foreground/30'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm">
            <span className="font-semibold">Q{index + 1}:</span>{' '}
            {text ? text.substring(0, 100) : 'Untitled'}
            {text && text.length > 100 ? '…' : ''}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
