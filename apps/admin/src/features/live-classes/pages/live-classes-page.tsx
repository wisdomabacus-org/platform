import { useMemo } from 'react';
import { LiveClassesHeader } from '../components/header';
import { LiveClassesDataTable } from '../components/data-table';
import { liveClassColumns } from '../components/columns';
import { mockLiveClasses } from '../components/mock';
import { LiveClassModal } from '../components/live-class-modal';

export default function LiveClassesPage() {
  const data = useMemo(() => mockLiveClasses, []);
  return (
    <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
      <LiveClassesHeader />
      <LiveClassesDataTable columns={liveClassColumns} data={data} pageSize={10} />
      <LiveClassModal
        onSubmit={(payload) => {
          console.log('LiveClass saved (UI only)', payload);
        }}
      />
    </div>
  );
}
