"use client";

import { useState } from "react";
import { toast } from "sonner"; // Assuming you use sonner or similar
import { Send, Loader2, ChevronDown } from "lucide-react";

import { useContactRequest } from "@/hooks/use-requests";
import { useRouter } from "next/navigation";

export function ContactForm() {
    const router = useRouter();
    const { mutate: submitContact, isPending: loading } = useContactRequest();
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        subject: 'admissions' | 'technical' | 'general' | 'partnership' | '';
        message: string;
    }>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (formData.phone.length < 10) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        if (!formData.subject) {
            toast.error("Please select a subject.");
            return;
        }

        submitContact(formData as any, { // Cast to any or ContactRequest because subject includes '' in state but API expects non-empty
            onSuccess: () => {
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                router.push("/");
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name & Email Row */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            {/* Phone & Subject Row */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>

                <div className="space-y-2 relative">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Subject
                    </label>
                    <div className="relative">
                        <select
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select a topic...</option>
                            <option value="admissions">New Admission Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="general">General Inquiry / Competition</option>
                            <option value="partnership">Partnership Opportunity</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Your Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#121212] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        Send Message <Send className="h-4 w-4" />
                    </>
                )}
            </button>

        </form>
    );
}