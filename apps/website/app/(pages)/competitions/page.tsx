import { TrainingBonusBanner } from "@/components/features/competition/list/training-bonus-banner";
import { CompetitionFullCard } from "@/components/features/competition/list/competition-full-card";
import { CompetitionsListHeader } from "@/components/features/competition/list/competitions-list-header";
import { getAllPublicCompetitionsServer } from "@/services/competitions.service";
import type { Competition } from "@/types/competition";

export default async function CompetitionsListPage() {
  let competitions: Competition[] = [];

  try {
    competitions = await getAllPublicCompetitionsServer({
      isPublished: true,
      status: 'open'
    });
  } catch (error) {
    console.error("Failed to fetch competitions:", error);
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      <CompetitionsListHeader />
      <div className="container mx-auto px-4 max-w-5xl">
        <TrainingBonusBanner />
        <div className="flex flex-col gap-6">
          {competitions.map((comp) => (
            <CompetitionFullCard key={comp.id} data={comp} />
          ))}
        </div>
        {competitions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-4">🧐</div>
            <h3 className="text-lg font-bold text-slate-900">No competitions found</h3>
            <p className="text-slate-500">Check back later for upcoming events.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export const revalidate = 300;