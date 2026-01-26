import Link from "next/link";
import { ChevronRight, CheckCircle2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompetitionHeaderProps {
    title: string;
    season: string;
    description: string;
}

export const CompetitionHeader = ({ title, season, description }: CompetitionHeaderProps) => {
    return (
        <div className="bg-slate-50 border-b border-slate-200 pt-8 pb-12">
            <div className="w-full lg:w-[70%] mx-auto px-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Link href="/" className="hover:text-orange-600">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/competitions" className="hover:text-orange-600">Competitions</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-900 font-medium">Details</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Registration Open
                            </Badge>
                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                                {season}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            {description}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
