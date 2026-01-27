
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { CompetitionForm } from '../components/competition-form';
import { useCompetition, useUpdateCompetition, useUpdateCompetitionSyllabus, useUpdateCompetitionPrizes } from '../hooks/use-competitions';
import { ROUTES } from '@/config/constants';
import { CompetitionFormValues } from '../types/competition-schema';
import { Loader2 } from 'lucide-react';

export default function CompetitionEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: competition, isLoading } = useCompetition(id!);
    const { mutateAsync: updateCompetition, isPending } = useUpdateCompetition();
    const { mutateAsync: updateSyllabus } = useUpdateCompetitionSyllabus();
    const { mutateAsync: updatePrizes } = useUpdateCompetitionPrizes();

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (!competition) {
        return <div>Competition not found</div>;
    }

    const handleSubmit = async (values: CompetitionFormValues) => {
        const { syllabus, prizes, ...basicInfo } = values;

        const payload: any = {
            ...basicInfo,
            exam_date: values.exam_date.toISOString(),
            registration_start_date: values.registration_start_date.toISOString(),
            registration_end_date: values.registration_end_date.toISOString(),
        };

        try {
            await updateCompetition({ id: id!, data: payload });

            if (syllabus) {
                await updateSyllabus({ id: id!, topics: syllabus });
            }

            if (prizes) {
                await updatePrizes({ id: id!, prizes: prizes });
            }

            navigate(ROUTES.COMPETITIONS);
        } catch (error) {
            console.error('Failed to update competition:', error);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            <PageHeader
                title={`Edit ${competition.title}`}
                description="Update competition details."
            />
            <CompetitionForm initialData={competition} onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    );
}
