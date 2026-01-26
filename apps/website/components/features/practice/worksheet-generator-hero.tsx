"use client";

import { Printer, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorksheetStore } from "@/stores/use-worksheet-store";

export const WorksheetGeneratorHero = () => {
    // Use Store Hook
    const { onOpen } = useWorksheetStore();

    return (
        <section className="w-full mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">

                {/* Left: Content */}
                <div className="p-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-3">
                        <Printer className="h-4 w-4" />
                        Offline Practice
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-[#121212] mb-3">
                        Worksheet Generator
                    </h2>
                    <p className="text-slate-500 text-base mb-6 max-w-md">
                        Need to practice away from the screen? Customize and download unlimited PDF worksheets for any level.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {/* BUTTON CLICK TRIGGERS MODAL */}
                        <Button
                            onClick={onOpen}
                            className="h-10 px-6 bg-[#121212] hover:bg-slate-800 text-white font-semibold shadow-sm transition-transform active:scale-95"
                        >
                            <Download className="mr-2 h-4 w-4" /> Create PDF
                        </Button>

                        <div className="h-10 px-4 flex items-center text-xs text-slate-400 bg-slate-50 rounded-md border border-slate-100">
                            <FileText className="mr-2 h-3 w-3" /> A4 Print Ready
                        </div>
                    </div>
                </div>

                {/* Right: Subtle Visual */}
                <div className="hidden md:flex w-1/3 bg-slate-50 border-l border-slate-100 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40" />
                    <div className="w-32 h-40 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 shadow-lg rotate-3 transition-transform hover:rotate-0 relative z-10">
                        <div className="w-16 h-2 bg-slate-100 rounded-full" />
                        <div className="w-20 h-2 bg-slate-100 rounded-full" />
                        <div className="w-12 h-2 bg-slate-100 rounded-full mt-4" />
                        <div className="absolute -right-3 -top-3 h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-md">
                            PDF
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
