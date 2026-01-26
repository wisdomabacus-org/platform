// src/features/portal/components/PortalLayout.tsx

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PortalLayout = ({ children, className }: PortalLayoutProps) => {
  const [isServerUp, setIsServerUp] = useState(true);

  // This will be used for the server status dot.
  useEffect(() => {
    // In Task 4, you will replace this with a real API call
    // to your backend's /health endpoint.
    //
    // try {
    //   const response = await fetch('/api/health');
    //   setIsServerUp(response.ok);
    // } catch (error) {
    //   setIsServerUp(false);
    // }
    
    // For now, we'll just mock it as "true".
    setIsServerUp(true);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* --- HEADER (Top Stripe) --- */}
      <header className="flex items-center gap-3 border-b bg-card px-4 py-3 shadow-sm">
        <img
          src="/brand.png" // Assumes brand.png is in your /public folder
          alt="Wisdom Abacus"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-extrabold text-foreground">Wisdom Abacus</span>
      </header>

      {/* --- MAIN CONTENT (Centers your pages) --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* This div applies the max-width to your cards, just like before */}
        <div className={cn("w-full max-w-2xl", className)}>
          {children}
        </div>
      </main>

      {/* --- FOOTER (Bottom Stripe) --- */}
      <footer className="flex items-center justify-between border-t bg-card px-4 py-2 text-xs shadow-sm">
        {/* Left: Server Status */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              isServerUp ? "bg-green-500" : "bg-red-600"
            )}
            title={isServerUp ? "Server is operational" : "Server is down"}
          />
          <span
            className={
              isServerUp ? "text-muted-foreground" : "font-semibold text-red-600"
            }
          >
            {isServerUp ? "All systems normal" : "Server down"}
          </span>
        </div>
        
        {/* Right: Credit */}
        <div className="text-muted-foreground">
          Designed and developed by Pegasus
        </div>
      </footer>
    </div>
  );
};