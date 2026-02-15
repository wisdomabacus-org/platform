import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { competitionSchema, CompetitionFormValues } from '../types/competition-schema';
import { Button } from '@/shared/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { TimePicker } from '@/shared/components/ui/time-picker';
import { Separator } from '@/shared/components/ui/separator';
import {
    CalendarIcon,
    Loader2,
    Plus,
    Trash2,
    Trophy,
    Medal,
    FileText,
    IndianRupee,
    Clock,
    HelpCircle,
    BookOpen,
    Award,
    Settings2,
    Calendar as CalendarIconSolid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Competition } from '../types/competition.types';

interface CompetitionFormProps {
    initialData?: Competition & { competition_syllabus?: any[]; competition_prizes?: any[] };
    onSubmit: (data: CompetitionFormValues) => void;
    isLoading?: boolean;
}

// Status configuration
const STATUS_CONFIG = {
    draft: { label: 'Draft', color: 'bg-slate-500' },
    published: { label: 'Published', color: 'bg-emerald-500' },
    upcoming: { label: 'Upcoming', color: 'bg-blue-500' },
    ongoing: { label: 'Ongoing', color: 'bg-orange-500' },
    completed: { label: 'Completed', color: 'bg-purple-500' },
    archived: { label: 'Archived', color: 'bg-zinc-600' },
} as const;

// Prize type configuration
const PRIZE_TYPES = [
    { value: 'trophy', label: 'Trophy', icon: Trophy },
    { value: 'medal', label: 'Medal', icon: Medal },
    { value: 'certificate', label: 'Certificate', icon: FileText },
    { value: 'cash', label: 'Cash Prize', icon: IndianRupee },
] as const;

export function CompetitionForm({ initialData, onSubmit, isLoading }: CompetitionFormProps) {
    const form = useForm<CompetitionFormValues>({
        resolver: zodResolver(competitionSchema) as any,
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            season: initialData?.season || new Date().getFullYear().toString(),
            status: (initialData?.status as any) || 'draft',
            description: initialData?.description || '',
            enrollment_fee: initialData?.enrollment_fee || 0,
            duration: initialData?.duration || 60,
            total_marks: initialData?.total_marks || 100,
            total_questions: initialData?.total_questions || 50,
            min_grade: initialData?.min_grade || 1,
            max_grade: initialData?.max_grade || 12,
            exam_date: initialData?.exam_date ? new Date(initialData.exam_date) : undefined,
            exam_window_start: initialData?.exam_window_start ? new Date(initialData.exam_window_start) : undefined,
            exam_window_end: initialData?.exam_window_end ? new Date(initialData.exam_window_end) : undefined,
            registration_start_date: initialData?.registration_start_date
                ? new Date(initialData.registration_start_date)
                : undefined,
            registration_end_date: initialData?.registration_end_date
                ? new Date(initialData.registration_end_date)
                : undefined,
            syllabus:
                (initialData?.competition_syllabus?.map((s) => ({
                    topic: s.topic,
                    description: s.description || '',
                })) || []) as any,
            prizes:
                (initialData?.competition_prizes?.map((p) => ({
                    rank: p.rank,
                    title: p.title,
                    description: p.description || '',
                    cash_prize: p.cash_prize || 0,
                    worth: p.worth || 0,
                    prize_type: p.prize_type || 'medal',
                })) || []) as any,
        } as any,
    });


    const {
        fields: syllabusFields,
        append: appendSyllabus,
        remove: removeSyllabus,
    } = useFieldArray({
        control: form.control as any,
        name: 'syllabus' as any,
    });

    const {
        fields: prizeFields,
        append: appendPrize,
        remove: removePrize,
    } = useFieldArray({
        control: form.control as any,
        name: 'prizes' as any,
    });

    // Auto-generate slug from title
    const watchTitle = form.watch('title');
    useEffect(() => {
        if (!initialData && watchTitle) {
            const slug = watchTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            form.setValue('slug', slug);
        }
    }, [watchTitle, initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* === SECTION: Basic Information === */}
                <section className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Basic Information</h3>
                            <p className="text-sm text-muted-foreground">
                                Core details about your competition
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 rounded-md border p-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField
                                control={form.control as any}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Competition Title <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. National Abacus Olympiad 2024"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The public-facing name of your competition
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            URL Slug <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="national-abacus-olympiad-2024"
                                                className="font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Auto-generated from title. Must be unique.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField
                                control={form.control as any}
                                name="season"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Season / Year</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2024" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status">
                                                        {field.value && (
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={cn(
                                                                        'h-2 w-2 rounded-full',
                                                                        STATUS_CONFIG[field.value as keyof typeof STATUS_CONFIG]?.color
                                                                    )}
                                                                />
                                                                {STATUS_CONFIG[field.value as keyof typeof STATUS_CONFIG]?.label}
                                                            </div>
                                                        )}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                                                    <SelectItem key={value} value={value}>
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn('h-2 w-2 rounded-full', config.color)} />
                                                            <span>{config.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide a detailed description of the competition, including eligibility, format, and what participants can expect..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Displayed on the competition page. Supports plain text.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Separator />

                {/* === SECTION: Schedule === */}
                <section className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500/10">
                            <CalendarIconSolid className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Schedule</h3>
                            <p className="text-sm text-muted-foreground">
                                Registration period and exam date
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 rounded-md border p-5 md:grid-cols-3">
                        <FormField
                            control={form.control as any}
                            name="registration_start_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Registration Opens <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, 'PPP') : 'Select date'}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="registration_end_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Registration Closes <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, 'PPP') : 'Select date'}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="exam_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>
                                        Exam Date <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, 'PPP') : 'Select date'}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Separator />

                {/* === SECTION: Exam Configuration === */}
                <section className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-500/10">
                            <Settings2 className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Exam Configuration</h3>
                            <p className="text-sm text-muted-foreground">
                                Duration, scoring, and pricing
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 rounded-md border p-5 md:grid-cols-2 lg:grid-cols-4">
                        <FormField
                            control={form.control as any}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        Duration
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                className="pr-12"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                mins
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="total_questions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                        Questions
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="total_marks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Award className="h-3.5 w-3.5 text-muted-foreground" />
                                        Total Marks
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="enrollment_fee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                        Entry Fee
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                ₹
                                            </span>
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                className="pl-7"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>Set 0 for free</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Grade Range & Exam Window */}
                    <div className="grid gap-5 rounded-md border p-5 md:grid-cols-2 lg:grid-cols-4">
                        <FormField
                            control={form.control as any}
                            name="min_grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Grade</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0-12"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="max_grade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Grade</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0-12"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="exam_window_start"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        Exam Start Time
                                    </FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select start time"
                                        />
                                    </FormControl>
                                    <FormDescription>When students can begin the exam</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="exam_window_end"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        Exam End Time
                                    </FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select end time"
                                        />
                                    </FormControl>
                                    <FormDescription>Deadline to submit the exam</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Separator />

                {/* === SECTION: Syllabus === */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-500/10">
                                <BookOpen className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold">Syllabus Topics</h3>
                                <p className="text-sm text-muted-foreground">
                                    Define the topics covered in the competition
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendSyllabus({ topic: '', description: '' })}
                            className="gap-1.5"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Topic
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {syllabusFields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 py-10 text-center">
                                <BookOpen className="mb-2 h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">No topics added yet</p>
                                <p className="mt-1 text-xs text-muted-foreground/70">
                                    Click "Add Topic" to define syllabus items
                                </p>
                            </div>
                        ) : (
                            syllabusFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="group relative flex gap-3 rounded-md border p-4"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <FormField
                                            control={form.control as any}
                                            name={`syllabus.${index}.topic` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Topic name (e.g., Addition & Subtraction)"
                                                            className="font-medium"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as any}
                                            name={`syllabus.${index}.description` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief description of what this topic covers..."
                                                            className="min-h-[60px] resize-none text-sm"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeSyllabus(index)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <Separator />

                {/* === SECTION: Prizes === */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10">
                                <Trophy className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold">Prizes & Awards</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure rewards for top performers
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                appendPrize({
                                    rank: prizeFields.length + 1,
                                    title: '',
                                    prize_type: 'medal',
                                    cash_prize: 0,
                                    worth: 0,
                                })
                            }
                            className="gap-1.5"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Prize
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {prizeFields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 py-10 text-center">
                                <Trophy className="mb-2 h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">No prizes configured</p>
                                <p className="mt-1 text-xs text-muted-foreground/70">
                                    Click "Add Prize" to define awards for winners
                                </p>
                            </div>
                        ) : (
                            prizeFields.map((field, index) => {
                                const rankColors = [
                                    'bg-amber-500 text-white',
                                    'bg-slate-400 text-white',
                                    'bg-orange-600 text-white',
                                    'bg-blue-500 text-white',
                                ];
                                const badgeClass = rankColors[Math.min(index, rankColors.length - 1)];

                                return (
                                    <div
                                        key={field.id}
                                        className="group relative rounded-md border p-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Rank Badge */}
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold',
                                                    badgeClass
                                                )}
                                            >
                                                #{index + 1}
                                            </div>

                                            {/* Prize Details Grid */}
                                            <div className="flex-1 space-y-4">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control as any}
                                                        name={`prizes.${index}.title` as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground">
                                                                    Prize Title
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="e.g., Gold Medal + Certificate"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control as any}
                                                        name={`prizes.${index}.prize_type` as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground">
                                                                    Type
                                                                </FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {PRIZE_TYPES.map(({ value, label, icon: Icon }) => (
                                                                            <SelectItem key={value} value={value}>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Icon className="h-3.5 w-3.5" />
                                                                                    {label}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control as any}
                                                        name={`prizes.${index}.cash_prize` as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground">
                                                                    Cash Prize
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                                            ₹
                                                                        </span>
                                                                        <Input
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            className="pl-7"
                                                                            {...field}
                                                                            value={field.value ?? ''}
                                                                            onChange={(e) =>
                                                                                field.onChange(e.target.value === '' ? '' : e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control as any}
                                                        name={`prizes.${index}.worth` as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs text-muted-foreground">
                                                                    Total Worth
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                                            ₹
                                                                        </span>
                                                                        <Input
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            className="pl-7"
                                                                            {...field}
                                                                            value={field.value ?? ''}
                                                                            onChange={(e) =>
                                                                                field.onChange(e.target.value === '' ? '' : e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={() => removePrize(index)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                <Separator />

                {/* === Submit Section === */}
                <div className="flex items-center justify-between rounded-md border bg-muted/30 p-5">
                    <div>
                        <p className="text-sm font-medium">Ready to save?</p>
                        <p className="text-xs text-muted-foreground">
                            {initialData
                                ? 'Your changes will be saved immediately'
                                : 'The competition will be created as a draft by default'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading} size="sm">
                            {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                            {initialData ? 'Save Changes' : 'Create Competition'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
