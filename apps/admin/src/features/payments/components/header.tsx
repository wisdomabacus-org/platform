export function PaymentsHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">Inspect transactions and reconcile issues.</p>
      </div>
    </div>
  );
}
