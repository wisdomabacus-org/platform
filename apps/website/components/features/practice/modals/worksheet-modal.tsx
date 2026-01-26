"use client";

import { useState } from "react";
import { X, Download, User, Mail, GraduationCap, Plus, Minus, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorksheetStore } from "@/stores/use-worksheet-store";
import { cn } from "@/lib/utils";
import { generatePDF } from "@/lib/worksheet-generator";

// Configuration Options
const OPTIONS = {
    questions: [25, 50, 100, 150, 200],
    rows: [2, 3, 4, 5, 10, 15, 20, 25],
    digits: [1, 2, 3, 4, 5],
    types: ["Student", "Teacher"]
};

export function WorksheetGeneratorModal() {
    const { isOpen, onClose } = useWorksheetStore();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        operators: ["addition"],
        questions: 50,
        rows: 4,
        digits: 1,
        name: "",
        email: "",
        type: "Student"
    });

    if (!isOpen) return null;

    const selectOperator = (op: string) => {
        setFormData(prev => ({
            ...prev,
            operators: [op]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await generatePDF(formData);
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#121212]/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-display font-bold text-[#121212]">Configure Worksheet</h2>
                        <p className="text-sm text-slate-500">Customize parameters for offline practice.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* 1. Operators Selection (Single Select) */}
                    <section>
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                            Select Operator
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { id: 'addition', icon: Plus, label: 'Addition' },
                                { id: 'subtraction', icon: Minus, label: 'Subtraction' },
                                { id: 'multiplication', icon: X, label: 'Multiply' },
                                { id: 'division', icon: Divide, label: 'Division' },
                            ].map((op) => {
                                const isSelected = formData.operators.includes(op.id);
                                return (
                                    <button
                                        key={op.id}
                                        type="button"
                                        onClick={() => selectOperator(op.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 gap-2",
                                            isSelected
                                                ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm scale-[1.02]"
                                                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <op.icon className={cn("h-6 w-6", isSelected ? "stroke-[3px]" : "stroke-2")} />
                                        <span className="text-xs font-bold">{op.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* 2. Complexity Config Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Questions */}
                        <section>
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                                Total Questions
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {OPTIONS.questions.map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setFormData({ ...formData, questions: num })}
                                        className={cn(
                                            "px-3 py-2 rounded-lg text-sm font-bold transition-all border",
                                            formData.questions === num
                                                ? "bg-[#121212] text-white border-[#121212] shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Rows */}
                        <section>
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                                No. of Rows
                            </Label>
                            <div className="grid grid-cols-4 gap-2">
                                {OPTIONS.rows.map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setFormData({ ...formData, rows: num })}
                                        className={cn(
                                            "h-9 rounded-lg text-sm font-bold transition-all border flex items-center justify-center",
                                            formData.rows === num
                                                ? "bg-[#121212] text-white border-[#121212] shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Digits */}
                        <section>
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                                Digits
                            </Label>
                            <div className="flex gap-2">
                                {OPTIONS.digits.map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setFormData({ ...formData, digits: num })}
                                        className={cn(
                                            "h-9 w-9 rounded-lg text-sm font-bold transition-all border flex items-center justify-center",
                                            formData.digits === num
                                                ? "bg-[#121212] text-white border-[#121212] shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* 3. User Details */}
                    <section className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Who is this for?
                            </Label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {OPTIONS.types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={cn(
                                            "flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2",
                                            formData.type === type
                                                ? "bg-white text-[#121212] shadow-sm"
                                                : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {type === "Student" ? <GraduationCap className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="name"
                                        placeholder="Enter name"
                                        className="pl-9 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email"
                                        className="pl-9 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer - Stacked on Mobile, Row on Desktop */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-400 text-center sm:text-left w-full sm:w-auto">
                        Generating <strong className="text-slate-600">{formData.questions}</strong> questions for <strong className="text-slate-600">{formData.name || 'User'}</strong>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none text-slate-500 hover:text-[#121212]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name}
                            className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 font-bold px-8"
                        >
                            {loading ? (
                                <span className="animate-pulse">Generating...</span>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </>
                            )}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}