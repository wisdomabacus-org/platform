import { useMemo } from 'react';
import { PaymentsHeader } from '../components/header';
import { PaymentsDataTable } from '../components/data-table';
import { paymentColumns } from '../components/columns';
import { mockPayments } from '../components/mock';

export default function PaymentsPage() {
  const data = useMemo(() => mockPayments, []);
  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <PaymentsHeader />
      <PaymentsDataTable columns={paymentColumns} data={data} pageSize={10} />
    </div>
  );
}
