import { useNavigate } from 'react-router-dom';
import { CompetitionForm } from '../components/competition-form';
import {
    useCreateCompetition,
    useUpdateCompetitionSyllabus,
    useUpdateCompetitionPrizes,
} from '../hooks/use-competitions';
import { ROUTES } from '@/config/constants';
import { CompetitionFormValues } from '../types/competition-schema';
import { PageHeader } from '@/shared/components/page-header';

export default function CompetitionCreatePage() {
    const navigate = useNavigate();
    const { mutateAsync: createCompetition, isPending } = useCreateCompetition();
    const { mutateAsync: updateSyllabus } = useUpdateCompetitionSyllabus();
    const { mutateAsync: updatePrizes } = useUpdateCompetitionPrizes();

    const handleSubmit = async (values: CompetitionFormValues) => {
        const { syllabus, prizes, ...basicInfo } = values;

        // Transform dates to ISO strings for DB
        const payload: any = {
            ...basicInfo,
            exam_date: values.exam_date.toISOString(),
            registration_start_date: values.registration_start_date.toISOString(),
            registration_end_date: values.registration_end_date.toISOString(),
            // Default expected values for required fields not in form
            exam_window_start: values.exam_date.toISOString(),
            exam_window_end: values.exam_date.toISOString(),
            min_grade: 1,
            max_grade: 12,
            slug:
                values.slug ||
                values.title
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, ''),
            status: values.status || 'draft',
        };

        try {
            const competition = await createCompetition(payload);

            if (syllabus && syllabus.length > 0) {
                await updateSyllabus({ id: competition.id, topics: syllabus });
            }

            if (prizes && prizes.length > 0) {
                await updatePrizes({ id: competition.id, prizes: prizes });
            }

            navigate(ROUTES.COMPETITIONS);
        } catch (error) {
            console.error('Failed to create competition:', error);
        }
    };

    return (
        <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl">
                <PageHeader
                    title="Create Competition"
                    description="Set up a new abacus competition."
                />
                <div className="mt-6">
                    <CompetitionForm onSubmit={handleSubmit} isLoading={isPending} />
                </div>
            </div>
        </div>
    );
}
