import Link from "next/link";
import { BookOpen, Users, Medal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CoursesSection = () => {
    return (
        <section className="py-[10%] bg-white">
            <div className="w-full lg:w-3/4 mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#121212] mb-4">
                        Master the Art of Abacus
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Whether you are preparing for the competition or starting from scratch,
                        our expert-led courses are designed to build speed, accuracy, and confidence.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Card 1: Curriculum */}
                    <Card className="h-full border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-orange-500 transition-colors" />
                        <CardHeader>
                            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-100">
                                <BookOpen className="h-6 w-6 text-slate-600" />
                            </div>
                            <CardTitle className="text-xl text-[#121212]">Structured Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-6">Grade-wise syllabus (Level 1 to 8) designed meticulously by industry experts.</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>Lvl 1</span>
                                <div className="h-px bg-slate-200 flex-1" />
                                <span>Lvl 8</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Live Classes */}
                    <Card className="h-full overflow-hidden border-orange-100 shadow-xl shadow-orange-100/50 transition-all hover:-translate-y-1 bg-white relative z-10 transform md:-mt-4 md:mb-4">
                        <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                            Recommended
                        </div>
                        <CardHeader>
                            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-200 text-white">
                                <Users className="h-7 w-7" />
                            </div>
                            <CardTitle className="text-2xl text-[#121212]">Live Interactive Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-6 text-base">
                                Small batch sizes (1:10 ratio) ensuring your child gets personal attention from certified trainers.
                            </p>
                            <Link href="/courses">
                                <Button className="w-full h-12 bg-[#121212] text-white hover:bg-slate-800 font-semibold shadow-lg">
                                    View Batches & Timings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Card 3: Certification (NO ISO) */}
                    <Card className="h-full border-amber-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-b from-amber-50/50 to-white relative overflow-hidden">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 border border-amber-200">
                                    <Medal className="h-6 w-6 text-amber-600" />
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-amber-500" />
                            </div>
                            <CardTitle className="text-xl text-[#121212]">Official Certification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 mb-4">
                                Get recognized for every milestone. Receive official <span className="font-semibold text-amber-700">Wisdom Abacus Academy</span> certificates upon completing each level.
                            </p>
                            <div className="mt-2 p-3 border border-amber-100 bg-white rounded flex items-center gap-3 opacity-80">
                                <div className="h-8 w-6 border-2 border-amber-100 rounded-sm flex flex-col justify-center items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-amber-100" />
                                    <div className="w-3 h-0.5 bg-amber-100" />
                                </div>
                                <div className="text-[10px] text-slate-400 leading-tight">
                                    Signed & Verified <br /> by Academy Head
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    );
}
