import { HeroSection } from "@/components/features/home/hero-section";
import { StatsSection } from "@/components/features/home/stats-section";
import { FeaturedCompetitionSection } from "@/components/features/home/featured-competition-section";
import { MockTestsSection } from "@/components/features/home/mock-tests-section";
import { CoursesSection } from "@/components/features/home/courses-section";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { FinalCTASection } from "@/components/features/home/final-cta-section";

// ✅ SEO: Optimized for the "Inaugural" Launch Event
export const metadata = {
  title: "Wisdom Abacus Academy | National Level Mental Math Competitions",
  description:
    "Join India's premier Abacus platform. 500+ students trust us for National Competitions and Mental Math courses. Register for Grade 1-6 today.",
};

export default async function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FeaturedCompetitionSection />
      <MockTestsSection />
      <CoursesSection />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}