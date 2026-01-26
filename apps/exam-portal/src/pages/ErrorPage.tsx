// src/pages/ErrorPage.tsx
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ServerCrash, Clock, Ban, XCircle } from "lucide-react";
import { PortalLayout } from "@/components/layouts/PortalLayout";

const MAIN_PLATFORM_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://wisdomabacus.com";

// Error configurations with icons and messages
const errorConfigs = {
  // Session-related errors
  SESSION_EXPIRED: {
    title: "Session Expired",
    message:
      "Your exam session has expired or is invalid. Please try starting the exam again from the main platform.",
    icon: Clock,
  },
  SESSION_NOT_FOUND: {
    title: "Session Not Found",
    message:
      "We couldn't find an active exam session. Please start the exam from the main platform.",
    icon: XCircle,
  },
  MISSING_SESSION: {
    title: "No Active Session",
    message:
      "No active exam session was found. Please ensure you started the exam from the main platform.",
    icon: XCircle,
  },

  // Initialization errors
  INITIALIZATION_FAILED: {
    title: "Initialization Failed",
    message:
      "Failed to initialize your exam session. Please try again or contact support if the issue persists.",
    icon: ServerCrash,
  },
  NO_EXAM_DATA: {
    title: "Exam Data Missing",
    message:
      "Exam data could not be loaded. Please refresh the page or start the exam again from the main platform.",
    icon: ServerCrash,
  },

  // Exam availability errors
  EXAM_NOT_AVAILABLE: {
    title: "Exam Not Available",
    message:
      "This exam is not currently available. Please check the exam schedule on the main platform.",
    icon: Clock,
  },
  EXAM_OVERDUE: {
    title: "Exam Period Over",
    message:
      "The time to take this exam has already passed. Please contact the academy for more information.",
    icon: Clock,
  },

  // Attempt errors
  ALREADY_TAKEN: {
    title: "Exam Already Attempted",
    message:
      "Our records show that you have already completed this exam. You cannot take it again.",
    icon: Ban,
  },
  MAX_ATTEMPTS_REACHED: {
    title: "Maximum Attempts Reached",
    message:
      "You have reached the maximum number of attempts for this exam.",
    icon: Ban,
  },

  // Default fallback
  DEFAULT: {
    title: "An Error Occurred",
    message:
      "We encountered an unexpected error. Please go back to the main platform and try again, or contact support if the problem persists.",
    icon: AlertTriangle,
  },
};

type ErrorKey = keyof typeof errorConfigs;

const ErrorPage = () => {
  const [searchParams] = useSearchParams();

  const errorCode = (searchParams.get("code") || "DEFAULT") as ErrorKey;
  const customMessage = searchParams.get("message");

  const errorConfig =
    errorConfigs[errorCode] || errorConfigs.DEFAULT;
  const IconComponent = errorConfig.icon;

  const handleGoToMainSite = () => {
    window.location.href = MAIN_PLATFORM_URL;
  };

  return (
    <PortalLayout className="flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <IconComponent className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="pt-4 text-center text-2xl text-destructive">
            {errorConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p className="text-muted-foreground">
            {customMessage ? decodeURIComponent(customMessage) : errorConfig.message}
          </p>
          {customMessage && (
            <p className="text-xs text-muted-foreground italic">
              Error Code: {errorCode}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            className="w-full"
            variant="default"
            onClick={handleGoToMainSite}
          >
            Go to Main Platform
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            If this issue persists, please contact support.
          </p>
        </CardFooter>
      </Card>
    </PortalLayout>
  );
};

export default ErrorPage;
