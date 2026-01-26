// src/features/exam/components/ExamLegend.tsx

import { cn } from "@/lib/utils";

const LegendItem = ({
  label,
  style,
  className = "",
}: {
  label: string;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={cn("h-3 w-3 flex-shrink-0 rounded-sm", className)}
      style={style}
    />
    <span className="text-muted-foreground">{label}</span>
  </div>
);

export const ExamLegend = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <LegendItem label="Current" className="bg-primary" />
      <LegendItem
        label="Answered"
        style={{ backgroundColor: "hsl(var(--question-answered))" }}
      />
      <LegendItem
        label="Marked"
        style={{ backgroundColor: "hsl(var(--question-marked))" }}
      />
      <LegendItem label="Not Visited" className="border" />
    </div>
  );
};
