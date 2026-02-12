import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ExamPage from "./pages/ExamPage";
import NotFoundPage from "./pages/NotFoundPage";
import InstructionsPage from "./pages/InstructionsPage";
import PortalInitializerPage from "./pages/PortalInitializerPage";
import CompletionPage from "./pages/CompletionPage";
import ErrorPage from "./pages/ErrorPage";
import { queryClient } from "./lib/queryClient";
import { useExamStore } from "./features/exam/store/examStore";

/**
 * Applies exam-type-based theme to the document root.
 * - mock-test → blue theme (.theme-mock-test)
 * - competition → default orange theme (no class)
 */
const ExamThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const examMetadata = useExamStore.use.examMetadata();

  useEffect(() => {
    const root = document.documentElement;

    if (examMetadata?.examType === "mock-test") {
      root.classList.add("theme-mock-test");
    } else {
      root.classList.remove("theme-mock-test");
    }

    // Cleanup on unmount
    return () => {
      root.classList.remove("theme-mock-test");
    };
  }, [examMetadata?.examType]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ExamThemeProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route index path="/" element={<PortalInitializerPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/complete" element={<CompletionPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ExamThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
