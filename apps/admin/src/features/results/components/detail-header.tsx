import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';

interface Props {
  title: string;
  grades: number[];
  status: 'pending' | 'published';
  publishedAt?: Date;
  total: number;
}

export function ResultDetailHeader({ title, grades, status, publishedAt, total }: Props) {
  return (
    <div className="w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto w-full max-w-4xl px-6 pt-5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Grades: {grades.join(', ')}</span>
          <span>Participants: {total}</span>
          <span className="flex items-center gap-2">
            Status:
            <Badge variant={status === 'published' ? 'default' : 'secondary'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </span>
          {publishedAt ? <span>Published: {publishedAt.toLocaleDateString()}</span> : null}
        </div>
        <Separator className="mt-4" />
      </div>
    </div>
  );
}
