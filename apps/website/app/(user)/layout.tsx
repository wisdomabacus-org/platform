import { Navbar } from "@/components/shared/nav/nav-bar";
import { Footer } from "@/components/shared/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
