"use client";

import { useState } from "react";
import {
    X, User, Phone, Mail, Calendar, CheckCircle2, Sparkles,
    Clock, GraduationCap, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoModal } from "@/stores/use-demo-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDemoRequest } from "@/hooks/use-requests";


export function BookDemoModal() {
    const { isOpen, onClose } = useDemoModal();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const router = useRouter();
    const { mutate: submitDemo, isPending: loading } = useDemoRequest();

    // Form State - Swapped 'age' for 'grade'
    const [formData, setFormData] = useState<{
        parentName: string;
        studentName: string;
        phone: string;
        email: string;
        grade: number;
        slot: "weekend" | "weekday";
    }>({
        parentName: "",
        studentName: "",
        phone: "",
        email: "",
        grade: 1, // Updated from age
        slot: "weekend"
    });

    if (!isOpen) return null;

    const handleClose = () => {
        setStep('form');
        setFormData({ parentName: "", studentName: "", phone: "", email: "", grade: 1, slot: "weekend" });
        onClose();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        submitDemo(formData, {
            onSuccess: () => {
                setStep('success');
                // Wait for 2 seconds to show success message then redirect
                setTimeout(() => {
                    handleClose();
                    router.push("/");
                }, 2000);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#121212]/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">

                {/* LEFT SIDE: Value Prop (Hidden on Mobile, Visible on Desktop) */}
                <div className="hidden md:flex w-[40%] bg-[#121212] p-10 flex-col justify-between relative overflow-hidden">
                    {/* Background FX */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles className="h-3 w-3" />
                            Free Evaluation
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white leading-tight mb-4">
                            See the Magic of <span className="text-orange-500">Mental Math.</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Book a free 45-minute live session. We assess your child's current level and create a personalized learning roadmap.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>1-on-1 Assessment</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>No Payment Required</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Course Material Preview</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: The Form */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#121212] transition-colors z-20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">

                        {step === 'form' ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#121212]">Reserve Your Spot</h3>
                                    <p className="text-slate-500 text-sm">Fill in the details below to schedule your demo.</p>
                                </div>

                                {/* Student Details Section */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</Label>
                                    <div className="grid grid-cols-[1fr_140px] gap-4">
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                required
                                                placeholder="Child's Name"
                                                className="pl-9 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                                                value={formData.studentName}
                                                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <select
                                                required
                                                className="flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.grade}
                                                onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                                                style={{ height: '2.5rem' /* matching standard Input height if needed, usually h-10 is 2.5rem */ }}
                                            >
                                                <option value={0}>UKC</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                                                    <option key={g} value={g}>Grade {g}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Parent Details Section */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent Contact</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            required
                                            placeholder="Parent's Name"
                                            className="pl-9 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                                            value={formData.parentName}
                                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                required
                                                type="tel"
                                                placeholder="Mobile Number"
                                                className="pl-9 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                required
                                                type="email"
                                                placeholder="Email Address"
                                                className="pl-9 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Slot Preference */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Time</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setFormData({ ...formData, slot: 'weekend' })}
                                            className={cn(
                                                "cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all",
                                                formData.slot === 'weekend'
                                                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                                    : "border-slate-200 hover:border-orange-200"
                                            )}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", formData.slot === 'weekend' ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400")}>
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#121212]">Weekend</p>
                                                <p className="text-[10px] text-slate-500">Sat-Sun (Flexible)</p>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setFormData({ ...formData, slot: 'weekday' })}
                                            className={cn(
                                                "cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all",
                                                formData.slot === 'weekday'
                                                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                                    : "border-slate-200 hover:border-orange-200"
                                            )}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", formData.slot === 'weekday' ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400")}>
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#121212]">Weekday</p>
                                                <p className="text-[10px] text-slate-500">Mon-Fri (Evening)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-[#121212] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg"
                                    >
                                        {loading ? "Confirming..." : "Confirm Booking"}
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-3">
                                        By clicking confirm, you agree to receive a callback from our academic counselor.
                                    </p>
                                </div>
                            </form>
                        ) : (
                            // SUCCESS STATE
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-[#121212] mb-2">Booking Confirmed!</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">
                                    Thank you, <span className="font-bold text-[#121212]">{formData.parentName}</span>.
                                    We have sent a confirmation details to <span className="font-bold text-[#121212]">{formData.phone}</span>.
                                </p>
                                <Button
                                    onClick={handleClose}
                                    variant="outline"
                                    className="border-slate-200"
                                >
                                    Close Window
                                </Button>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}