// src/features/exam/hooks/useExamTimer.ts

import { useEffect, useRef } from "react";
import { useExamStore } from "../store/examStore";

export const useExamTimer = () => {
  const timeLeft = useExamStore.use.timeLeft();
  const isExamSubmitted = useExamStore.use.isExamSubmitted();
  const decrementTime = useExamStore.use.decrementTime();
  // ✅ Get the exam metadata to check if the exam is loaded
  const examMetadata = useExamStore.use.examMetadata();

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // ✅ Add a check for examMetadata.
    // Do not start the timer until the exam is actually loaded.
    if (!examMetadata || isExamSubmitted || timeLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // ✅ Add examMetadata to the dependency array
  }, [decrementTime, isExamSubmitted, timeLeft, examMetadata]);

  // ✅ Check if the exam is loaded
  const isLoaded = examMetadata !== null;

  return {
    timeLeft,
    // ✅ The exam is only "Time Up" if it has been loaded AND time is 0
    isTimeUp: isLoaded && timeLeft === 0 && !isExamSubmitted,
  };
};