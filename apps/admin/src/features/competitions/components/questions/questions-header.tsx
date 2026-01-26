import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { Upload } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  meta?: {
    totalQuestions?: number;
    gradeRange?: string;
    fee?: string;
    status?: string;
  };
  search: string;
  setSearch: (v: string) => void;
  onImport?: () => void;
}

export function QuestionsHeader({
  title,
  subtitle,
  meta,
  search,
  setSearch,
  onImport,
}: Props) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 w-full backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
          {/* Meta row */}

          <div className="mt-3 flex items-center justify-between gap-3">
            <Input
              placeholder="Search question number or text…"
              className="w-full max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className='flex gap-x-5'>
              {meta ? (
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {meta.totalQuestions !== undefined && (
                    <span>Questions: {meta.totalQuestions}</span>
                  )}
                  {meta.gradeRange && <span>Grades: {meta.gradeRange}</span>}
                  {meta.fee && <span>Fee: {meta.fee}</span>}
                  {meta.status && <span>Status: {meta.status}</span>}
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-4" />
      </div>
    </div>
  );
}
