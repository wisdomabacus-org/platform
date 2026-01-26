import { Navbar } from "@/components/shared/nav/nav-bar";
import { Footer } from "@/components/shared/Footer";
import { BookDemoModal } from "@/components/features/courses/modals/book-demo";
import { WorksheetGeneratorModal } from "@/components/features/practice/modals/worksheet-modal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <BookDemoModal />
      <WorksheetGeneratorModal />
    </div>
  );
}