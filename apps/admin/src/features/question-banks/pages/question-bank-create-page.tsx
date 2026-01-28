import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { QuestionBankForm } from '../components/forms/question-bank-form';
import { useCreateQuestionBank } from '../hooks/use-question-banks';
import { QuestionBankFormValues } from '../types/question-bank-schema';
import { PageHeader } from '@/shared/components/page-header';

export default function QuestionBankCreatePage() {
    const navigate = useNavigate();
    const { mutate: createQuestionBank, isPending } = useCreateQuestionBank();

    const handleSave = (values: QuestionBankFormValues) => {
        createQuestionBank(values as any, {
            onSuccess: (data: any) => {
                navigate(ROUTES.QUESTION_BANKS_DETAIL.replace(':id', data.id));
            }
        });
    };

    return (
        <div className="px-4 py-6 w-full">
            <div className="space-y-6">
                <PageHeader
                    title="Create Question Bank"
                    description="Set up a new collection of practice questions."
                />
                <div className="mt-6">
                    <QuestionBankForm
                        onCancel={() => navigate(ROUTES.QUESTION_BANKS)}
                        onSave={handleSave}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    );
}
