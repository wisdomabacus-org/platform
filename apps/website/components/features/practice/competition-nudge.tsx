import Link from "next/link";
import { Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CompetitionNudge = () => {
    return (
        <div className="flex items-center justify-between bg-[#121212] rounded-2xl p-6 mb-12 shadow-lg shadow-slate-200">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center shrink-0 shadow-inner">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-base font-bold text-white leading-none mb-1">
                        Season 1 is Live
                    </p>
                    <p className="text-sm text-slate-400">
                        Test your skills globally. Win prizes up to ₹10k.
                    </p>
                </div>
            </div>
            <Link href="/competitions">
                <Button size="sm" variant="link" className="text-orange-400 hover:text-white h-auto p-0 font-bold decoration-orange-400/30">
                    View Details <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
            </Link>
        </div>
    );
};
