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

        // Combine exam_date with exam_window times to create proper timestamps
        const examDate = values.exam_date;
        const windowStart = values.exam_window_start;
        const windowEnd = values.exam_window_end;

        // Create proper timestamps by combining exam_date with the selected times
        const examWindowStart = new Date(examDate);
        examWindowStart.setHours(windowStart.getHours(), windowStart.getMinutes(), 0, 0);

        const examWindowEnd = new Date(examDate);
        examWindowEnd.setHours(windowEnd.getHours(), windowEnd.getMinutes(), 0, 0);

        // Transform dates to ISO strings for DB
        const payload: any = {
            ...basicInfo,
            exam_date: values.exam_date.toISOString(),
            exam_window_start: examWindowStart.toISOString(),
            exam_window_end: examWindowEnd.toISOString(),
            registration_start_date: values.registration_start_date.toISOString(),
            registration_end_date: values.registration_end_date.toISOString(),
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
