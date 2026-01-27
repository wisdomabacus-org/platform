
import { useMemo } from 'react';
import { QuestionBanksHeader } from '../components/header';
import { QuestionBanksDataTable } from '../components/data-table';
import { questionBankColumns } from '../components/columns';
import { useQuestionBanks } from '../hooks/use-question-banks';
import { Loader2 } from 'lucide-react';

export default function QuestionBanksPage() {
    const { data: questionBanks, isLoading } = useQuestionBanks();

    const data = useMemo(() => questionBanks || [], [questionBanks]);

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-4 overflow-y-scroll px-8 py-4">
            <QuestionBanksHeader />
            <QuestionBanksDataTable columns={questionBankColumns} data={data} pageSize={10} />
        </div>
    );
}
