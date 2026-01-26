import { Calendar, Clock, Users } from "lucide-react";

export const ScheduleSection = () => {
    return (
        <section className="py-16 bg-white border-b border-slate-100">
            {/* Content Container - 75% Width */}
            <div className="w-full lg:w-[70%] mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* Left: Text */}
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-display font-bold text-slate-900">
                            Master Math Without <br />
                            <span className="text-orange-600">Disturbing School.</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            We understand your child's busy schedule. That's why our classes are
                            strategically timed for the weekends and Monday evenings.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Days</p>
                                    <p className="font-bold text-slate-900">Sat • Sun • Mon</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Evening Batch</p>
                                    <p className="font-bold text-slate-900">08:00 PM - 09:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Card */}
                    <div className="flex-1 w-full">
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users className="h-5 w-5 text-orange-500" /> Batch Details
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <span className="text-slate-400">Mode</span>
                                    <span className="font-bold">Online (Zoom) & Offline</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <span className="text-slate-400">Ratio</span>
                                    <span className="font-bold">1 Teacher : 10 Students</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <span className="text-slate-400">Duration per Level</span>
                                    <span className="font-bold text-orange-400">3 - 4 Months*</span>
                                </li>
                            </ul>
                            <p className="text-xs text-slate-500 mt-4 italic">
                                *Duration depends on student's individual progress and practice.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
