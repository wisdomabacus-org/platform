import { notFound } from "next/navigation";
import {
  Calculator,
  Wifi,
  MonitorPlay,
  LogIn
} from "lucide-react";

import { CompetitionHeader } from "@/components/features/competition/details/competition-header";
import { TrainingBanner } from "@/components/features/competition/details/training-banner";
import { PrizePodium } from "@/components/features/competition/details/prize-podium";
import { SyllabusSection } from "@/components/features/competition/details/syllabus-section";
import { RulesSection } from "@/components/features/competition/details/rules-section";
import { RegistrationTimer } from "@/components/features/competition/details/registration-timer";
import { EnrollmentCard } from "@/components/features/competition/details/enrollment-card";
import { getCompetitionByIdServer } from "@/services/competitions.service";
import Link from "next/link";

// ----------------------------------------------------------------------
// STATIC RULES (Platform Standard)
// ----------------------------------------------------------------------
const PLATFORM_RULES = [
  { icon: Calculator, text: "No calculators or external devices allowed." },
  { icon: Wifi, text: "Stable internet connection (Min 2 Mbps)." },
  { icon: LogIn, text: "Login 15 minutes before starting your slot." },
  { icon: MonitorPlay, text: "Exam works on Laptop/Desktop/Tablet." }
];

// ----------------------------------------------------------------------
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default async function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let competition;
  try {
    competition = await getCompetitionByIdServer(slug);
  } catch (error) {
    console.error("Error fetching competition:", error);
    notFound();
  }

  if (!competition) {
    notFound();
  }

  // Format time window
  const startTime = new Date(competition.examWindowStart).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const endTime = new Date(competition.examWindowEnd).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const examTimeWindow = `${startTime} - ${endTime}`;

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* 1. HEADER */}
      <CompetitionHeader
        title={competition.title}
        season={competition.season}
        description={competition.description}
      />

      {/* 2. MAIN CONTENT */}
      <div className="w-full lg:w-[70%] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Training Banner */}
            {competition.isTrainingAvailable && <TrainingBanner />}

            {/* Prizes */}
            <PrizePodium prizes={competition.prizes} />

            {/* Syllabus */}
            <SyllabusSection syllabus={competition.syllabus} />

            {/* Rules */}
            <RulesSection rules={PLATFORM_RULES} />

          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">

              {/* Timer - Only show when registration is open */}
              <RegistrationTimer
                targetDate={competition.registrationEndDate}
                competitionStatus={competition.status}
                registrationStartDate={competition.registrationStartDate}
              />

              {/* Ticket Card */}
              <EnrollmentCard
                competitionId={competition.id}
                enrollmentFee={competition.enrollmentFee}
                originalFee={competition.originalFee}
                examDate={competition.examDate}
                examWindowStart={competition.examWindowStart}
                examWindowEnd={competition.examWindowEnd}
                examTimeWindow={examTimeWindow}
                duration={competition.duration}
                minGrade={competition.minGrade}
                maxGrade={competition.maxGrade}
              />

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Have questions? <Link href="/contact-us" className="text-orange-600 font-bold hover:underline">Contact Support</Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}