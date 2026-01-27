import Link from "next/link";
import { Calendar, MapPin, Users, Trophy, Medal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedCompetitionServer } from "@/services/competitions.service";
import { CompetitionFallbackSection } from "./competition-fallback-section";

export const FeaturedCompetitionSection = async () => {
    const competition = await getFeaturedCompetitionServer();
    if (!competition) {
        return <CompetitionFallbackSection />;
    }

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Extract specific prizes for display
    const cashPrize = competition.prizes[0];
    return (
        <section className="py-[10%] bg-white">
            <div className="w-full lg:w-3/4 mx-auto px-4">

                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#121212]">
                        The Main Event
                    </h2>
                    <p className="text-slate-500 mt-3 text-lg">
                        India's most prestigious online mental math face-off.
                    </p>
                </div>

                {/* The Big "Ticket" Container */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
                    <div className="h-2 w-full bg-gradient-to-r from-orange-500 to-red-600" />

                    <div className="grid lg:grid-cols-12 gap-0">

                        {/* LEFT: The Visual & Key Info */}
                        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50" />

                            <div className="relative z-10 space-y-6">
                                {competition.status === 'open' && (
                                    <div className="inline-block px-3 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
                                        ● Registration Open
                                    </div>
                                )}

                                <h3 className="text-3xl md:text-5xl font-bold text-[#121212] leading-tight">
                                    {competition.title} <br />
                                    <span className="text-orange-600">{competition.season}</span>
                                </h3>

                                <div className="flex flex-wrap gap-6 text-slate-600 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-orange-500" />
                                        <span className="font-medium">{formatDate(competition.examDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-orange-500" />
                                        <span className="font-medium">Online (Anywhere)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-orange-500" />
                                        <span className="font-medium">Grade {competition.minGrade} - {competition.maxGrade}</span>
                                    </div>
                                </div>

                                {/* Prizes Section - UPDATED */}
                                <div className="pt-6 border-t border-slate-100 mt-6">
                                    <p className="text-sm text-slate-400 uppercase font-semibold mb-3">Prizes & Recognition</p>
                                    <div className="flex flex-wrap gap-4">
                                        {/* Prize 1: Cash */}
                                        {cashPrize && (
                                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                <Trophy className="h-8 w-8 text-yellow-500" />
                                                <div>
                                                    <p className="font-bold text-[#121212]">₹{cashPrize.worth}</p>
                                                    <p className="text-xs text-slate-500">{cashPrize.title}</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Prize 2: Medals */}
                                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                            <Medal className="h-8 w-8 text-slate-400" />
                                            <div>
                                                <p className="font-bold text-[#121212]">Medals</p>
                                                <p className="text-xs text-slate-500">For all</p>
                                            </div>
                                        </div>

                                        {/* Prize 3: Certificates */}
                                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                            <FileText className="h-8 w-8 text-orange-400" />
                                            <div>
                                                <p className="font-bold text-[#121212]">Certificates</p>
                                                <p className="text-xs text-slate-500">& Mementos</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: The Action Area */}
                        <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 border-l border-slate-200 flex flex-col justify-center items-center text-center">
                            <div className="space-y-6 w-full max-w-sm">
                                <div className="space-y-2">
                                    <p className="text-slate-500 text-sm uppercase tracking-widest">Entry Fee</p>
                                    <p className="text-5xl font-bold text-[#121212]">₹{competition.enrollmentFee}<span className="text-lg text-slate-400 font-normal">/student</span></p>
                                </div>

                                <Link href={`/competitions/${competition.slug}`} className="block w-full">
                                    <Button size="lg" className="w-full h-14 text-lg bg-[#121212] hover:bg-slate-800 text-white shadow-lg">
                                        Register Now
                                    </Button>
                                </Link>

                                <p className="text-xs text-slate-400">
                                    *Includes Mock Test & E-Certificate. <br />
                                    100% Secure Payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
