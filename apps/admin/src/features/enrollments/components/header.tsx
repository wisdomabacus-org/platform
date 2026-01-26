export function EnrollmentsHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Enrollments</h2>
        <p className="text-muted-foreground">Track registrations and payment statuses.</p>
      </div>
    </div>
  );
}
