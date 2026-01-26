import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface Item {
  _id: string;
}

interface Props {
  items: Item[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function MockQGrid({ items, activeId, onSelect, onDelete, onNew }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* New tile */}
        <Card
          className="hover:border-primary flex aspect-square cursor-pointer items-center justify-center border border-dashed text-sm"
          onClick={onNew}
        >
          + New
        </Card>

        {items.map((q, idx) => {
          const active = activeId === q._id;
          return (
            <Card
              key={q._id}
              className={`relative flex aspect-square cursor-pointer items-center justify-center border text-sm font-medium transition-colors ${
                active ? 'border-primary' : 'hover:border-muted-foreground/30'
              }`}
              onClick={() => onSelect(q._id)}
            >
              <span>Q{idx + 1}</span>
              <div className="absolute top-1 right-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(q._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
