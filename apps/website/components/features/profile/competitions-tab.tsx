import { Trophy } from "lucide-react";
import { User } from "@/types/auth";

interface CompetitionsTabProps {
    user: User;
}

export const CompetitionsTab = ({ user }: CompetitionsTabProps) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">My Competitions</h3>
                    <p className="text-sm text-slate-500">History and upcoming events.</p>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    Total: {user.enrolledCompetitions?.length || 0}
                </span>
            </div>

            {user.enrolledCompetitions && user.enrolledCompetitions.length > 0 ? (
                <div className="space-y-4">
                    {/* Competition cards would go here - fetched from backend */}
                    <div className="text-center py-8 text-slate-500">
                        <Trophy className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                        <p>Competition details will be loaded here.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No competitions yet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                        Enroll in an upcoming championship to see it listed here.
                    </p>
                </div>
            )}
        </div>
    );
};
