
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { CompetitionForm } from '../components/competition-form';
import { useCreateCompetition } from '../hooks/use-competitions';
import { ROUTES } from '@/config/constants';
import { CompetitionFormValues } from '../types/competition-schema';

export default function CompetitionCreatePage() {
    const navigate = useNavigate();
    const { mutate: createCompetition, isPending } = useCreateCompetition();

    const handleSubmit = (values: CompetitionFormValues) => {
        // Transform dates to ISO strings for DB
        const payload: any = {
            ...values,
            exam_date: values.exam_date.toISOString(),
            registration_start_date: values.registration_start_date.toISOString(),
            registration_end_date: values.registration_end_date.toISOString(),
            // Default expected values for required fields not in form
            exam_window_start: values.exam_date.toISOString(),
            exam_window_end: values.exam_date.toISOString(),
            min_grade: 1,
            max_grade: 12,
            slug: values.slug || values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            status: values.status || 'draft',
        };

        createCompetition(payload, {
            onSuccess: () => {
                navigate(ROUTES.COMPETITIONS);
            }
        });
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            <PageHeader
                title="Create Competition"
                description="Set up a new abacus competition."
            />
            <CompetitionForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    );
}
