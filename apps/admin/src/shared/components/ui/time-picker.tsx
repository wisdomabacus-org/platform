import * as React from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select time",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Extract hours and minutes from the date value
  const hours = value ? value.getHours() : 0;
  const minutes = value ? value.getMinutes() : 0;

  // Format time for display (12-hour format with AM/PM)
  const formatTime = (date: Date | undefined) => {
    if (!date) return placeholder;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Create a new date with the selected time
  const updateTime = (newHours: number, newMinutes: number) => {
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(newHours);
    newDate.setMinutes(newMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    onChange(newDate);
  };

  const incrementHours = () => {
    const newHours = (hours + 1) % 24;
    updateTime(newHours, minutes);
  };

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24;
    updateTime(newHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + 5) % 60;
    updateTime(hours, newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - 5 + 60) % 60;
    updateTime(hours, newMinutes);
  };

  // Quick select common times
  const quickTimes = [
    { label: "9:00 AM", hours: 9, minutes: 0 },
    { label: "10:00 AM", hours: 10, minutes: 0 },
    { label: "11:00 AM", hours: 11, minutes: 0 },
    { label: "12:00 PM", hours: 12, minutes: 0 },
    { label: "1:00 PM", hours: 13, minutes: 0 },
    { label: "2:00 PM", hours: 14, minutes: 0 },
    { label: "3:00 PM", hours: 15, minutes: 0 },
    { label: "4:00 PM", hours: 16, minutes: 0 },
    { label: "5:00 PM", hours: 17, minutes: 0 },
    { label: "6:00 PM", hours: 18, minutes: 0 },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          {/* Time Selector */}
          <div className="flex items-center justify-center gap-4">
            {/* Hours */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={incrementHours}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <div className="flex h-10 w-12 items-center justify-center rounded-md border bg-muted text-lg font-semibold">
                {hours.toString().padStart(2, "0")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={decrementHours}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            <span className="text-2xl font-bold text-muted-foreground">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={incrementMinutes}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <div className="flex h-10 w-12 items-center justify-center rounded-md border bg-muted text-lg font-semibold">
                {minutes.toString().padStart(2, "0")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={decrementMinutes}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Quick Select */}
          <div className="border-t pt-3">
            <p className="mb-2 text-xs text-muted-foreground">Quick select</p>
            <div className="grid grid-cols-5 gap-1">
              {quickTimes.map((time) => (
                <Button
                  key={time.label}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-1 text-xs",
                    hours === time.hours &&
                      minutes === time.minutes &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => {
                    updateTime(time.hours, time.minutes);
                    setIsOpen(false);
                  }}
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
