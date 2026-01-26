export function MockQHeader({ total }: { total: number }) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 w-full backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <h1 className="text-2xl font-semibold tracking-tight">Mock Test Questions</h1>
        <p className="text-muted-foreground">Manage all MCQs for this mock test.</p>
        <div className="text-muted-foreground mt-2 text-sm">Total: {total}</div>
        <div className="mt-3 border-t" />
      </div>
    </div>
  );
}
