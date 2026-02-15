import { useNavigate, useParams } from 'react-router-dom';
import { CompetitionForm } from '../components/competition-form';
import {
    useCompetition,
    useUpdateCompetition,
    useUpdateCompetitionSyllabus,
    useUpdateCompetitionPrizes,
} from '../hooks/use-competitions';
import { ROUTES } from '@/config/constants';
import { CompetitionFormValues } from '../types/competition-schema';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { FileEdit } from 'lucide-react';
import { createISTDate } from '@/lib/date-utils';

function EditPageSkeleton() {
    return (
        <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[200px] rounded-md" />
                    <Skeleton className="h-[120px] rounded-md" />
                    <Skeleton className="h-[100px] rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default function CompetitionEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: competition, isLoading } = useCompetition(id!);
    const { mutateAsync: updateCompetition, isPending } = useUpdateCompetition();
    const { mutateAsync: updateSyllabus } = useUpdateCompetitionSyllabus();
    const { mutateAsync: updatePrizes } = useUpdateCompetitionPrizes();

    if (isLoading) {
        return <EditPageSkeleton />;
    }

    if (!competition) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-destructive/10">
                    <FileEdit className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">Competition Not Found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    The competition you're looking for doesn't exist or has been deleted.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.COMPETITIONS)} className="mt-4">
                    Back to Competitions
                </Button>
            </div>
        );
    }

    const handleSubmit = async (values: CompetitionFormValues) => {
        const { syllabus, prizes, ...basicInfo } = values;

        // Create IST timestamps for exam window times
        // This ensures 9:00 AM IST is stored correctly and will be displayed as 9:00 AM
        const examWindowStart = createISTDate(values.exam_date, values.exam_window_start);
        const examWindowEnd = createISTDate(values.exam_date, values.exam_window_end);

        const payload: any = {
            ...basicInfo,
            exam_date: values.exam_date.toISOString(),
            exam_window_start: examWindowStart.toISOString(),
            exam_window_end: examWindowEnd.toISOString(),
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

            navigate(ROUTES.COMPETITIONS_DETAIL.replace(':id', id!));
        } catch (error) {
            console.error('Failed to update competition:', error);
        }
    };

    return (
        <div className="px-4 py-6">
            <div className="mx-auto max-w-3xl">
                <PageHeader
                    title="Edit Competition"
                    description={competition.title}
                />
                <div className="mt-6">
                    <CompetitionForm
                        initialData={competition}
                        onSubmit={handleSubmit}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    );
}
