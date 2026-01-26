"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoModal } from "@/stores/use-demo-store";

export const PricingSection = () => {
    const { onOpen } = useDemoModal();
    return (
        <section className="py-20 bg-white">
            {/* Content Container - 75% Width */}
            <div className="w-full lg:w-[70%] mx-auto px-4">
                <div className="bg-gradient-to-br from-slate-900 to-[#121212] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-display font-bold">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-slate-400 text-lg max-w-md">
                                No hidden annual fees. Pay monthly as you learn.
                                Includes access to online practice portal and weekly live classes.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {['3 Classes / Week', 'Small Batch Size', 'Portal Access', 'Personal Feedback'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white text-slate-900 rounded-2xl p-8 w-full max-w-sm shadow-xl">
                            <div className="text-center border-b border-slate-100 pb-6 mb-6">
                                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Monthly Fee</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-2xl font-bold text-slate-400">₹</span>
                                    <span className="text-6xl font-display font-bold text-slate-900">4,000</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">Per Student / Month</p>
                            </div>
                            <Button
                                onClick={onOpen}
                                className="w-full h-14 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                            >
                                Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <p className="text-center text-xs text-slate-400 mt-4">
                                *Registration fee may apply for new students (Kit + Books).
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
