import { PracticeHeader } from "@/components/features/practice/practice-header";
import { WorksheetGeneratorHero } from "@/components/features/practice/worksheet-generator-hero";
import { CompetitionNudge } from "@/components/features/practice/competition-nudge";
import { MockTestCard } from "@/components/features/practice/mock-test-card";
import { mockTestsService } from "@/services/mock-tests.service";
import type { MockTest } from "@/types/mock-test";


export default async function PracticePage() {
  let mockTests: MockTest[] = [];

  try {
    mockTests = await mockTestsService.getAll();
  } catch (error) {
    console.error("Failed to fetch mock tests:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      <PracticeHeader />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <WorksheetGeneratorHero />
        <CompetitionNudge />
        <div>
          <h2 className="text-2xl font-bold text-[#121212] mb-6 flex items-center gap-2">
            Online Mock Tests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <MockTestCard key={test.id} test={test} />
            ))}
          </div>
          {mockTests.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-slate-900">No mock tests available</h3>
              <p className="text-slate-500">Check back later for new practice tests.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export const revalidate = 300;