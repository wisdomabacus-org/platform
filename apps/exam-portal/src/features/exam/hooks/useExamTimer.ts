// src/features/exam/hooks/useExamTimer.ts

import { useEffect, useRef } from "react";
import { useExamStore } from "../store/examStore";

export const useExamTimer = () => {
  const timeLeft = useExamStore.use.timeLeft();
  const isExamSubmitted = useExamStore.use.isExamSubmitted();
  const decrementTime = useExamStore.use.decrementTime();
  const examMetadata = useExamStore.use.examMetadata();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate if exam should be running
  const shouldRun = !!examMetadata && !isExamSubmitted && timeLeft > 0;

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start interval if exam should be running
    if (!shouldRun) return;

    intervalRef.current = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // Only depends on shouldRun, not timeLeft - prevents interval recreation every second
  }, [shouldRun, decrementTime]);

  const isLoaded = examMetadata !== null;

  return {
    timeLeft,
    // The exam is only "Time Up" if it has been loaded AND time is 0
    isTimeUp: isLoaded && timeLeft === 0 && !isExamSubmitted,
  };
};