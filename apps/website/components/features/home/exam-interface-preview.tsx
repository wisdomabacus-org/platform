import { Timer } from "lucide-react";

export const ExamInterfacePreview = () => (
    <div className="w-full h-full bg-white flex flex-col font-sans text-[10px] sm:text-xs overflow-hidden select-none cursor-default">
        {/* Top Bar */}
        <div className="h-9 sm:h-10 bg-[#121212] text-white flex items-center justify-between px-3 sm:px-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
                <span className="font-bold text-orange-500">Wisdom Exam</span>
                {/* Hidden on mobile to save space */}
                <span className="text-slate-400 hidden sm:inline text-[10px] sm:text-xs">Section A: Mental Math</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 py-1 rounded text-[10px] sm:text-xs font-mono">
                <Timer className="h-3 w-3 text-orange-500" />
                <span>09:45</span>
            </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">

            {/* Left Grid Sidebar - HIDDEN on Mobile (display: none -> flex on sm) */}
            {/* This clears the 'junk' on small screens and gives the question full width */}
            <div className="hidden sm:flex w-24 bg-slate-50 border-r border-slate-200 p-3 flex-col gap-3 overflow-y-auto shrink-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Palette</p>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-bold transition-all ${i === 4 ? 'bg-orange-600 text-white shadow-md scale-110' : // Current
                            i < 4 ? 'bg-green-100 text-green-700 border border-green-200' :   // Answered
                                'bg-white text-slate-400 border border-slate-200'         // Pending
                            }`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 p-3 sm:p-6 bg-white flex flex-col min-w-0">

                {/* Question Header */}
                <div className="flex justify-between items-start mb-4 sm:mb-6 gap-2">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Question 5</span>
                        <h4 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-snug">
                            Calculate the value of (45 + 23) - 12
                        </h4>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded shrink-0 whitespace-nowrap">
                        2 Marks
                    </span>
                </div>

                {/* Options */}
                <div className="space-y-2 sm:space-y-3 w-full max-w-full sm:max-w-md">
                    {[
                        { val: 'A', text: '54' },
                        { val: 'B', text: '56', selected: true },
                        { val: 'C', text: '62' },
                        { val: 'D', text: '48' }
                    ].map((opt) => (
                        <div key={opt.val} className={`w-full border rounded-lg flex items-center px-3 py-2 sm:py-2.5 transition-all ${opt.selected ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white'
                            }`}>
                            <div className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border flex items-center justify-center mr-3 text-[9px] sm:text-[10px] font-bold shrink-0 ${opt.selected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300 text-slate-500'
                                }`}>
                                {opt.val}
                            </div>
                            <span className={`text-xs sm:text-sm font-medium truncate ${opt.selected ? 'text-orange-900' : 'text-slate-600'}`}>
                                {opt.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Fake Footer Buttons */}
                <div className="mt-auto pt-4 sm:pt-6 flex justify-between items-center border-t border-slate-100">
                    <div className="h-6 sm:h-8 w-16 sm:w-20 bg-slate-100 rounded-md" />
                    <div className="h-6 sm:h-8 w-20 sm:w-24 bg-[#121212] rounded-md shadow-lg" />
                </div>
            </div>
        </div>
    </div>
);