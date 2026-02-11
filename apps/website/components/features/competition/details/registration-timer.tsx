"use client";

import { useState, useEffect } from "react";
import { calculateTimeRemaining } from "@/lib/utils/date-helpers";

interface RegistrationTimerProps {
    targetDate: string;
    competitionStatus?: string;
    registrationStartDate?: string;
}

export const RegistrationTimer = ({ targetDate, competitionStatus, registrationStartDate }: RegistrationTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(targetDate));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeRemaining(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Don't render anything on server to avoid hydration mismatch
    if (!mounted) return null;

    // Hide timer completely when:
    // 1. Registration period has ended (timeLeft.isPast)
    // 2. Competition is closed, completed, or live (no longer accepting registrations)
    const shouldHideTimer = timeLeft.isPast || 
        competitionStatus === 'closed' || 
        competitionStatus === 'completed' || 
        competitionStatus === 'live';

    if (shouldHideTimer) {
        return null;
    }

    // Show different messages based on status
    const getMessage = () => {
        if (competitionStatus === 'upcoming') {
            return "Registration Opens In";
        }
        return "Registration Closes In";
    };

    return (
        <div className="bg-[#121212] rounded-xl p-4 text-center text-white mb-6 shadow-lg">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">{getMessage()}</p>
            <div className="flex justify-center gap-2 text-center">
                <div>
                    <div className="bg-white/10 rounded p-2 min-w-[40px]">
                        <span className="text-xl font-bold font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Days</span>
                </div>
                <span className="text-xl font-bold text-slate-500 self-start mt-1">:</span>
                <div>
                    <div className="bg-white/10 rounded p-2 min-w-[40px]">
                        <span className="text-xl font-bold font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Hrs</span>
                </div>
                <span className="text-xl font-bold text-slate-500 self-start mt-1">:</span>
                <div>
                    <div className="bg-white/10 rounded p-2 min-w-[40px]">
                        <span className="text-xl font-bold font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Mins</span>
                </div>
            </div>
        </div>
    );
};
