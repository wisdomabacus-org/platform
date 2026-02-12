"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { useEnrollmentStatus } from "@/hooks/use-enrollments";
import { useRazorpay } from "@/hooks/use-payment";
import { useStartExam } from "@/hooks/use-exam";
import { isInExamWindow, isDatePassed, formatDateShort } from "@/lib/utils/date-helpers";
import { toast } from "sonner";
import { useAuthModal, useProfileModal } from "@/stores/modal-store";

interface EnrollmentCardProps {
    competitionId: string;
    enrollmentFee: number;
    originalFee?: number;
    examDate: string;
    examWindowStart: string;
    examWindowEnd: string;
    examTimeWindow: string;
    duration: number; // in minutes
    minGrade: number;
    maxGrade: number;
    registrationEndDate?: string;
    competitionStatus?: string;
}

export const EnrollmentCard = ({
    competitionId,
    enrollmentFee,
    originalFee,
    examDate,
    examWindowStart,
    examWindowEnd,
    examTimeWindow,
    duration,
    minGrade,
    maxGrade,
    registrationEndDate,
    competitionStatus
}: EnrollmentCardProps) => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const { data: enrollmentStatus, isLoading: isCheckingEnrollment, refetch } = useEnrollmentStatus(competitionId);
    const { initiatePayment, isProcessing } = useRazorpay();
    const { mutate: startExam, isPending: isStartingExam } = useStartExam();

    const { onOpen: openAuthModal } = useAuthModal();
    const { onOpen: openProfileModal } = useProfileModal();

    const isEnrolled = enrollmentStatus?.isEnrolled || false;
    const canStartExam = isEnrolled && isInExamWindow(examWindowStart, examWindowEnd);

    // Check if registration period has closed
    const isRegistrationClosed = registrationEndDate
        ? isDatePassed(registrationEndDate)
        : (competitionStatus === 'closed' || competitionStatus === 'completed' || competitionStatus === 'live');

    const handleEnrollClick = async () => {
        // Check authentication
        if (!isAuthenticated || !user) {
            openAuthModal("login");
            return;
        }

        // Check if profile is complete
        if (!user.isProfileComplete) {
            toast.error("Please complete your profile to proceed");
            openProfileModal();
            return;
        }

        // Initiate payment
        try {
            await initiatePayment(competitionId, {
                name: user.parentName || user.studentName || "",
                email: user.email || "",
                contact: user.phone || ""
            });
            // After successful payment, refetch enrollment status
            await refetch();
            router.refresh();
        } catch (error: any) {
            console.error("Enrollment failed:", error);
        }
    };

    const handleStartExam = () => {
        startExam({
            examId: competitionId,
            examType: 'competition'
        });
    };

    const getButtonContent = () => {
        if (isCheckingEnrollment) {
            return (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking...
                </>
            );
        }

        if (isEnrolled) {
            if (canStartExam) {
                return isStartingExam ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Starting Exam...
                    </>
                ) : "Start Exam";
            }
            return "Enrolled ✓";
        }

        // Not enrolled — check if registration is closed
        if (isRegistrationClosed) {
            return (
                <>
                    <LockKeyhole className="mr-2 h-5 w-5" />
                    Registration Closed
                </>
            );
        }

        return isProcessing ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
            </>
        ) : "Enroll Now";
    };

    const isButtonDisabled = () => {
        if (isCheckingEnrollment || isProcessing || isStartingExam) return true;
        if (isEnrolled && !canStartExam) return true;
        if (!isEnrolled && isRegistrationClosed) return true;
        return false;
    };

    const handleButtonClick = () => {
        if (isEnrolled && canStartExam) {
            handleStartExam();
        } else if (!isEnrolled && !isRegistrationClosed) {
            handleEnrollClick();
        }
    };

    const getButtonStyles = () => {
        if (!isEnrolled && isRegistrationClosed) {
            return "w-full h-14 text-lg font-bold bg-slate-400 text-white cursor-not-allowed";
        }
        return "w-full h-14 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed";
    };

    return (
        <Card className="border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-orange-600 h-2 w-full" />
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entry Fee</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">₹{enrollmentFee}</span>
                    {originalFee && originalFee > enrollmentFee && (
                        <>
                            <span className="text-sm text-slate-500 line-through">₹{originalFee}</span>
                            <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                {Math.round(((originalFee - enrollmentFee) / originalFee) * 100)}% OFF
                            </Badge>
                        </>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    {/* Exam Date */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                            <Calendar className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Exam Date</p>
                            <p className="text-sm font-bold text-slate-900">{formatDateShort(examDate)}</p>
                        </div>
                    </div>

                    {/* Flexible Time Window */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                            <Clock className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Exam Window</p>
                            <p className="text-sm font-bold text-slate-900">{examTimeWindow}</p>
                            <p className="text-xs text-slate-500">Duration: {duration} Mins</p>
                        </div>
                    </div>

                    {/* Updated Grade Range */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                            <Users className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Eligibility</p>
                            <p className="text-sm font-bold text-slate-900">Grade {minGrade} - {maxGrade}</p>
                        </div>
                    </div>
                </div>

                {/* Enrollment Status Badge */}
                {isEnrolled && (
                    <div className="pt-4 border-t border-slate-100">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <p className="text-sm font-bold text-green-700">✓ You're Enrolled!</p>
                            {canStartExam && (
                                <p className="text-xs text-green-600 mt-1">Exam window is now open</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Registration Closed Notice */}
                {!isEnrolled && isRegistrationClosed && (
                    <div className="pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                            <p className="text-sm font-bold text-slate-500">Registration period has ended</p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    size="lg"
                    className={getButtonStyles()}
                    onClick={handleButtonClick}
                    disabled={isButtonDisabled()}
                >
                    {getButtonContent()}
                </Button>
            </CardFooter>
        </Card>
    );
};
