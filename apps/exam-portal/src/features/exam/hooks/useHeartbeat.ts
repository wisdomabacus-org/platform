// src/features/exam/hooks/useHeartbeat.ts
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHeartbeatQuery } from "../api/exam.queries";
import { useExamStore } from "../store/examStore";

const HEARTBEAT_INTERVAL_MS = 15000; // 15 seconds

/**
 * Hook that periodically syncs with the backend to:
 * 1. Reconcile time remaining
 * 2. Detect if session was submitted/expired elsewhere
 * 3. Trigger auto-submit when server says to
 */
export const useHeartbeat = () => {
    const navigate = useNavigate();
    const examMetadata = useExamStore.use.examMetadata();
    const isExamSubmitted = useExamStore.use.isExamSubmitted();
    const submitExam = useExamStore.use.submitExam();
    const setTimeLeft = useExamStore.use.setTimeLeft();

    // Track if we've already handled auto-submit to prevent loops
    const hasHandledAutoSubmit = useRef(false);

    const { data, refetch } = useHeartbeatQuery({
        enabled: !!examMetadata && !isExamSubmitted,
        refetchInterval: HEARTBEAT_INTERVAL_MS,
        // Don't throw on error - just retry
        retry: false,
    });

    // Handle heartbeat response
    useEffect(() => {
        if (!data?.success || !data.data || hasHandledAutoSubmit.current) return;

        const heartbeat = data.data;

        // Sync time from server (use server as source of truth, with some tolerance)
        // Only update if difference is significant (> 5 seconds) to avoid jitter
        const currentTimeLeft = useExamStore.getState().timeLeft;
        const serverTime = heartbeat.timeRemaining;
        const timeDiff = Math.abs(currentTimeLeft - serverTime);

        if (timeDiff > 5) {
            setTimeLeft(serverTime);
        }

        // Handle terminal states
        if (heartbeat.status === "submitted" || heartbeat.status === "expired") {
            hasHandledAutoSubmit.current = true;
            submitExam();
            navigate("/complete");
            return;
        }

        // Handle auto-submit signal from server
        if (heartbeat.shouldAutoSubmit) {
            hasHandledAutoSubmit.current = true;
            submitExam();
            navigate("/complete");
        }
    }, [data, navigate, submitExam, setTimeLeft]);

    // Reset the auto-submit flag when exam metadata changes (new exam)
    useEffect(() => {
        hasHandledAutoSubmit.current = false;
    }, [examMetadata?.examSessionId]);

    return { refetch };
};
