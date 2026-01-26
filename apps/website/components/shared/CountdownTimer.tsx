"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date; // Make sure to pass a Date object
  label?: string;
}

const CountdownTimer = ({
  targetDate,
  label = "Time Remaining",
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Ensure targetDate is a Date object
    const target = new Date(targetDate);

    const calculateTimeLeft = () => {
      const difference = +target - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-1">
              <div className="text-2xl font-display font-bold text-primary">
                {String(unit.value).padStart(2, "0")}
              </div>
            </div>
            <div className="text-xs text-gray-500">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
