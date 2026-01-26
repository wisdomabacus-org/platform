"use client";

import { CourseHero } from "@/components/features/courses/course-hero";
import { ScheduleSection } from "@/components/features/courses/schedule-section";
import { CurriculumRoadmap } from "@/components/features/courses/curriculum-roadmap";
import { PricingSection } from "@/components/features/courses/pricing-section";

// ----------------------------------------------------------------------
// 5. MAIN PAGE EXPORT
// ----------------------------------------------------------------------
export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white">
      <CourseHero />
      <ScheduleSection />
      <CurriculumRoadmap />
      <PricingSection />
    </main>
  );
}