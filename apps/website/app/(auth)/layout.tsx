import { AuthFooter } from "@/components/features/auth/AuthFooter";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden">

      {/* Global Ambient Background for all Auth Pages */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <AuthHeader />

      {/* Main Content - Centered */}
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        {children}
      </main>

      <AuthFooter />

      <Toaster richColors position="top-right" />
    </div>
  );
}