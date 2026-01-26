import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ExamPage from "./pages/ExamPage";
import NotFoundPage from "./pages/NotFoundPage";
import InstructionsPage from "./pages/InstructionsPage";
import PortalInitializerPage from "./pages/PortalInitializerPage";
import CompletionPage from "./pages/CompletionPage";
import ErrorPage from "./pages/ErrorPage";
import { queryClient } from "./lib/queryClient";


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
