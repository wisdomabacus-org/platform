import Link from "next/link";
import { Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamInterfacePreview } from "./exam-interface-preview";

export const MockTestsSection = () => {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="w-full lg:w-3/4 mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left: The New Exam Interface Preview */}
                    <div className="relative group">
                        {/* Background Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                        <div className="relative bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl">
                            <div className="bg-slate-100 rounded-xl overflow-hidden aspect-video border border-slate-200 relative">
                                {/* ✅ THE NEW HTML EXAM PREVIEW */}
                                <ExamInterfacePreview />
                            </div>

                            {/* Floating Feature Tag */}
                            <div className="absolute -right-6 top-10 bg-[#121212] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-left-4 duration-700 delay-200">
                                <Timer className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Real-time</p>
                                    <p className="font-bold">Exam Timer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm font-semibold">
                            <Zap className="h-4 w-4" />
                            <span>Practice makes perfect</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#121212]">
                            Experience the Exam Hall <br /> Before the Big Day.
                        </h2>
                        <p className="text-lg text-slate-600">
                            Don't let exam anxiety affect the score. Our AI-powered mock tests
                            simulate the exact environment of the National Championship.
                        </p>
                        <div className="pt-4">
                            <Link href="/practice">
                                <Button size="lg" variant="outline" className="border-slate-300 text-[#121212] hover:bg-white hover:border-orange-500">
                                    Start a Free Mock Test
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
