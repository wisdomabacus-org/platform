import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Input } from '@/shared/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { questionBanksService } from '@/features/question-banks/api/question-banks.service';
import { useAssignQuestionBanks, useCompetitionQuestionBanks } from '../hooks/use-competitions';
import { Search, FileQuestion, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AssignQuestionBankModalProps {
    competitionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface QuestionBankSelection {
    id: string;
    title: string;
    grades: number[];
    selected: boolean;
}

export function AssignQuestionBankModal({
    competitionId,
    open,
    onOpenChange,
}: AssignQuestionBankModalProps) {
    const [search, setSearch] = useState('');
    const [selections, setSelections] = useState<QuestionBankSelection[]>([]);

    // Fetch all available question banks
    const { data: questionBanksData, isLoading: isLoadingBanks } = useQuery({
        queryKey: ['question-banks', 'all'],
        queryFn: () => questionBanksService.getAll({ limit: 100 }),
        enabled: open,
    });

    // Fetch currently assigned question banks
    const { data: assignedBanks, isLoading: isLoadingAssigned } = useCompetitionQuestionBanks(competitionId);

    // Assign mutation
    const { mutate: assignQuestionBanks, isPending: isAssigning } = useAssignQuestionBanks();

    // Initialize selections when data loads
    useEffect(() => {
        if (questionBanksData?.data && assignedBanks) {
            const assignedIds = new Set(assignedBanks.map((ab: any) => ab.question_bank_id));
            setSelections(
                questionBanksData.data.map((qb) => ({
                    id: qb.id,
                    title: qb.title,
                    grades: [qb.minGrade || 1, qb.maxGrade || 12],
                    selected: assignedIds.has(qb.id),
                }))
            );
        }
    }, [questionBanksData, assignedBanks]);

    const toggleSelection = (id: string) => {
        setSelections((prev) =>
            prev.map((sel) =>
                sel.id === id ? { ...sel, selected: !sel.selected } : sel
            )
        );
    };

    const handleSave = () => {
        const selectedBanks = selections.filter((s) => s.selected);
        const assignments = selectedBanks.map((s) => ({
            question_bank_id: s.id,
            grades: Array.from({ length: s.grades[1] - s.grades[0] + 1 }, (_, i) => s.grades[0] + i),
        }));

        assignQuestionBanks(
            { id: competitionId, assignments },
            {
                onSuccess: () => {
                    toast.success(`${selectedBanks.length} question bank(s) assigned successfully`);
                    onOpenChange(false);
                },
            }
        );
    };

    const filteredSelections = selections.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
    );

    const isLoading = isLoadingBanks || isLoadingAssigned;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileQuestion className="h-5 w-5" />
                        Assign Question Banks
                    </DialogTitle>
                    <DialogDescription>
                        Select the question banks to assign to this competition.
                        Questions will be pulled from selected banks during the exam.
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search question banks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Question Banks List */}
                <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : filteredSelections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileQuestion className="h-10 w-10 text-muted-foreground/30" />
                            <p className="mt-3 text-sm text-muted-foreground">
                                {search ? 'No question banks match your search' : 'No question banks available'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredSelections.map((qb) => (
                                <div
                                    key={qb.id}
                                    className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleSelection(qb.id)}
                                >
                                    <Checkbox
                                        checked={qb.selected}
                                        onCheckedChange={() => toggleSelection(qb.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{qb.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                Grades {qb.grades[0]} - {qb.grades[1]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Count */}
                <div className="text-sm text-muted-foreground">
                    {selections.filter((s) => s.selected).length} question bank(s) selected
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isAssigning}>
                        {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
