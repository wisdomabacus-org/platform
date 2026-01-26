import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

interface Draft {
  questionText: string;
  options: string[];
  correctIndex: number | null;
}
interface Props {
  mode: 'create' | 'edit';
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
}

export function MockQForm({
  mode,
  draft,
  setDraft,
  onAdd,
  onUpdate,
  onCancelEdit,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {mode === 'edit' ? 'Edit Question' : 'Add New Question'}
      </h3>

      <div className="space-y-2">
        <Label htmlFor="q">Question</Label>
        <Textarea
          id="q"
          rows={5}
          placeholder="Type the question here..."
          value={draft.questionText}
          onChange={(e) => setDraft({ questionText: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Answer Options</Label>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={draft.options[i] ?? ''}
              onChange={(e) => {
                const copy = [...draft.options];
                copy[i] = e.target.value;
                setDraft({ options: copy });
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Select
          value={draft.correctIndex !== null ? String(draft.correctIndex) : ''}
          onValueChange={(v) => setDraft({ correctIndex: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select answer" />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3].map((i) => (
              <SelectItem key={i} value={String(i)}>
                Option {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {mode === 'create' ? (
        <Button className="w-full" onClick={onAdd}>
          Add Question to List
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update Question</Button>
        </div>
      )}
    </div>
  );
}
