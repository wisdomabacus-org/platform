"use client";

import Link from "next/link";
import {
    Calendar,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Info,
    GraduationCap,
    Clock,
    Trophy,
    Loader2,
    Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
} from "@/components/ui/card";
import type { Competition } from "@/types/competition";
import { isInExamWindow, isDatePassed, formatDateShort } from "@/lib/utils/date-helpers";

import { useAuthModal, useProfileModal } from "@/stores/modal-store";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

import { useEnrollmentStatus } from "@/hooks/use-enrollments";
import { useRazorpay } from "@/hooks/use-payment";
import { useStartExam } from "@/hooks/use-exam";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export const CompetitionFullCard = ({ data }: { data: Competition }) => {
    const router = useRouter();
    const { user, isAuthenticated } = useCurrentUser();
    const { onOpen: openAuthModal } = useAuthModal();
    const { onOpen: openProfileModal } = useProfileModal();

    const { data: enrollmentStatus, refetch, isLoading: isCheckingEnrollment } = useEnrollmentStatus(data.id);
    const { initiatePayment, isProcessing } = useRazorpay();
    const { mutate: startExam, isPending: isStartingExam } = useStartExam();

    const isEnrolled = enrollmentStatus?.isEnrolled || false;
    const canStartExam = isEnrolled && isInExamWindow(data.examWindowStart, data.examWindowEnd);
    const isExamDatePassed = isDatePassed(data.examDate);
    const isRegistrationClosed = isDatePassed(data.registrationEndDate) || 
        (data.status === 'closed' || data.status === 'completed' || data.status === 'live');

    // Check if user has already completed this competition
    const { data: submissionStatus, isLoading: isCheckingSubmission } = useQuery({
        queryKey: ["competition-submission", data.id, user?.id],
        queryFn: async () => {
            const supabase = createClient();
            const { data: submission, error } = await supabase
                .from('submissions')
                .select('id, status, score, submitted_at')
                .eq('user_id', user!.id)
                .eq('competition_id', data.id)
                .eq('exam_type', 'competition')
                .maybeSingle();
            
            if (error) {
                console.error("Error checking submission status:", error);
                return null;
            }
            return submission;
        },
        enabled: isAuthenticated && isEnrolled && !!user?.id,
        staleTime: 5 * 60 * 1000,
    });

    const hasCompleted = submissionStatus?.status === 'completed' || submissionStatus?.status === 'auto-submitted';
    const isInProgress = submissionStatus?.status === 'in-progress';
    const isExamCompleted = hasCompleted || (isEnrolled && isExamDatePassed && !isInProgress);

    const isProfileComplete = (user: any) => {
        if (!user) return false;
        return (
            user.studentName &&
            user.studentGrade &&
            user.schoolName &&
            user.parentName &&
            user.phone &&
            user.city &&
            user.state &&
            user.dateOfBirth
        );
    };

    const handleEnrollClick = async () => {
        if (!user) {
            openAuthModal("register");
            return;
        }

        if (!isProfileComplete(user)) {
            openProfileModal();
            return;
        }

        try {
            await initiatePayment(data.id, {
                name: user.parentName || user.studentName || "",
                email: user.email || "",
                contact: user.phone || ""
            });
            await refetch();
            toast.success("Enrollment successful!");
        } catch (error: any) {
            console.error("Enrollment failed:", error);
        }
    };

    const handleStartExam = () => {
        if (!isEnrolled) {
            toast.error("You are not enrolled in this competition. Please enroll first.");
            return;
        }
        if (!isInExamWindow(data.examWindowStart, data.examWindowEnd)) {
            toast.error("The exam window is not currently open. Please check the exam schedule.");
            return;
        }
        startExam({
            examId: data.id,
            examType: 'competition'
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "upcoming":
                return { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Upcoming", icon: Calendar };
            case "open":
                return { color: "bg-green-50 text-green-700 border-green-200", label: "Registration Open", icon: CheckCircle2 };
            case "closed":
                return { color: "bg-slate-100 text-slate-600 border-slate-200", label: "Registration Closed", icon: AlertCircle };
            case "live":
                return { color: "bg-red-50 text-red-700 border-red-200", label: "Live Now", icon: CheckCircle2 };
            case "completed":
                return { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Completed", icon: Calendar };
            default:
                return { color: "bg-slate-50 text-slate-600 border-slate-200", label: "Unknown", icon: Info };
        }
    };

    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;

    // Get primary button content and state
    const getPrimaryButton = () => {
        const isLoading = isCheckingEnrollment || isCheckingSubmission;
        
        if (isLoading) {
            return (
                <Button
                    disabled
                    className="w-full h-11 font-bold text-base shadow-lg bg-slate-200 text-slate-500 cursor-not-allowed"
                >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                </Button>
            );
        }

        // Completed state
        if (isExamCompleted) {
            return (
                <Button
                    disabled
                    className="w-full h-11 font-bold text-base bg-green-600 text-white cursor-default"
                >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Completed
                </Button>
            );
        }

        // In progress state
        if (isInProgress) {
            return (
                <Button
                    onClick={handleStartExam}
                    disabled={isStartingExam}
                    className="w-full h-11 font-bold text-base bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200"
                >
                    {isStartingExam ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resuming...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Resume Exam
                        </>
                    )}
                </Button>
            );
        }

        // Enrolled - show Start Exam
        if (isEnrolled) {
            const isDisabled = !canStartExam || isStartingExam;
            return (
                <Button
                    onClick={handleStartExam}
                    disabled={isDisabled}
                    className={`w-full h-11 font-bold text-base shadow-lg transition-all ${
                        canStartExam 
                            ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-200"
                            : "bg-orange-400 text-white cursor-not-allowed"
                    }`}
                >
                    {isStartingExam ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Exam
                        </>
                    )}
                </Button>
            );
        }

        // Not enrolled - show Enroll Now or Registration Closed
        if (isRegistrationClosed) {
            return (
                <Button
                    disabled
                    className="w-full h-11 font-bold text-base bg-slate-400 text-white cursor-not-allowed"
                >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Registration Closed
                </Button>
            );
        }

        return (
            <Button
                onClick={handleEnrollClick}
                disabled={isProcessing}
                className="w-full h-11 font-bold text-base bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-200 transition-all"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        );
    };

    // Get status message for below the button
    const getStatusMessage = () => {
        if (isCheckingEnrollment || isCheckingSubmission) return null;
        
        if (isEnrolled && !canStartExam && !isExamCompleted && !isInProgress) {
            const examWindowStarted = isDatePassed(data.examWindowStart);
            if (!examWindowStarted) {
                return {
                    text: `Window opens ${formatDateShort(data.examWindowStart)}`,
                    type: "info" as const
                };
            }
            return {
                text: "Window closed",
                type: "info" as const
            };
        }
        
        return null;
    };

    const statusMessage = getStatusMessage();

    return (
        <Card className="group py-0 overflow-hidden border-slate-200 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 bg-white">
            <div className="flex flex-col lg:flex-row">

                {/* LEFT: Event Details */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className={`${statusConfig.color} border flex items-center gap-1.5 px-3 py-1.5`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {statusConfig.label}
                            </Badge>
                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Season 1</span>
                        </div>

                        <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                            {data.title}
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                            <GraduationCap className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">Grade {data.minGrade === 0 ? 'UKG' : data.minGrade} - {data.maxGrade}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{data.duration} Mins</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">National Level</span>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Timeline */}
                <div className="lg:w-[300px] bg-slate-50/50 p-5 md:p-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                    <div className="flex flex-row justify-between items-center lg:items-start lg:flex-col lg:space-y-6 w-full">

                        {/* Date Item 1 */}
                        <div className="relative lg:pl-4 lg:border-l-2 lg:border-slate-200">
                            <div className="hidden lg:block absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-white" />

                            <div className="lg:hidden flex items-center gap-2 mb-1">
                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Last Date</p>
                            </div>

                            <p className="hidden lg:block text-xs font-bold text-slate-400 uppercase mb-0.5">Last Date</p>

                            <p className="text-sm md:text-base lg:text-lg font-bold text-slate-900 leading-tight">
                                {formatDateShort(data.registrationEndDate)}
                            </p>
                        </div>

                        <div className="lg:hidden h-8 w-[1px] bg-slate-200 mx-2" />

                        {/* Date Item 2 */}
                        <div className="relative lg:pl-4 lg:border-l-2 lg:border-slate-200">
                            <div className="hidden lg:block absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-400 ring-4 ring-white" />

                            <div className="lg:hidden flex items-center gap-2 mb-1">
                                <div className="h-2 w-2 rounded-full bg-slate-400" />
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Exam Date</p>
                            </div>

                            <p className="hidden lg:block text-xs font-bold text-slate-400 uppercase mb-0.5">Exam Date</p>

                            <p className="text-sm md:text-base lg:text-lg font-bold text-slate-900 leading-tight">
                                {formatDateShort(data.examDate)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Action & Pricing */}
                <div className="lg:w-[280px] p-5 md:p-6 flex flex-col justify-center items-center lg:items-end bg-slate-50">
                    <div className="text-center lg:text-right mb-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entry Fee</p>
                        <div className="flex items-baseline justify-center lg:justify-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">₹{data.enrollmentFee}</span>
                            {data.originalFee && (
                                <span className="text-sm text-slate-400 line-through">₹{data.originalFee}</span>
                            )}
                        </div>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center justify-center lg:justify-end gap-1">
                            <Sparkles className="h-3 w-3" /> Early Bird Offer
                        </p>
                    </div>

                    <div className="w-full space-y-2">
                        {getPrimaryButton()}
                        
                        {/* Status message below button */}
                        {statusMessage && (
                            <p className="text-[10px] text-center text-slate-500">
                                {statusMessage.text}
                            </p>
                        )}

                        <Link href={`/competitions/${data.slug}`} className="w-full block">
                            <Button
                                variant="outline"
                                className="w-full h-11 font-semibold text-slate-700 border-slate-300 hover:bg-white hover:text-orange-600 hover:border-orange-200 transition-all"
                            >
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </Card>
    );
};
