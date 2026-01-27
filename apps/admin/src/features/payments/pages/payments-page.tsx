
import { useMemo } from 'react';
import { PaymentsHeader } from '../components/header';
import { PaymentsDataTable } from '../components/data-table';
import { paymentColumns } from '../components/columns';
import { usePayments } from '../hooks/use-payments';
import { RevenueAnalytics } from '../components/revenue-analytics';
import { Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const { data: paymentsData, isLoading } = usePayments();
  const data = useMemo(() => paymentsData?.data || [], [paymentsData]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <PaymentsHeader />
      <RevenueAnalytics />
      <PaymentsDataTable columns={paymentColumns} data={data} pageSize={10} />
    </div>
  );
}
