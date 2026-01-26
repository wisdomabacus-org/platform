import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsSection = () => {
    return (
        <section className="py-[8%] bg-slate-50 border-y border-slate-200">
            <div className="w-full lg:w-3/4 mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-bold text-[#121212]">Trusted by Parents</h2>
                    <p className="text-slate-500 mt-2">Based on reviews from JustDial & Google</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Review 1 */}
                    <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
                        <CardContent className="pt-8">
                            <div className="flex gap-1 text-yellow-400 mb-4">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                            </div>
                            <Quote className="h-8 w-8 text-orange-100 mb-2" />
                            <p className="text-slate-700 italic mb-6">
                                "My son used to struggle with math, but after joining Wisdom Abacus, his calculation speed has improved drastically. The offline classes were great, and I am excited for the online platform."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">RJ</div>
                                <div>
                                    <p className="font-bold text-sm text-[#121212]">Rajesh J.</p>
                                    <p className="text-xs text-slate-400">Parent, Level 3 Student</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review 2 */}
                    <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
                        <CardContent className="pt-8">
                            <div className="flex gap-1 text-yellow-400 mb-4">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                            </div>
                            <Quote className="h-8 w-8 text-orange-100 mb-2" />
                            <p className="text-slate-700 italic mb-6">
                                "Best institute for Abacus. The teachers are very patient with kids. We have been associated with them for 2 years now. Highly recommended."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">SK</div>
                                <div>
                                    <p className="font-bold text-sm text-[#121212]">Sneha K.</p>
                                    <p className="text-xs text-slate-400">Parent, Level 5 Student</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review 3 */}
                    <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all">
                        <CardContent className="pt-8">
                            <div className="flex gap-1 text-yellow-400 mb-4">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                            </div>
                            <Quote className="h-8 w-8 text-orange-100 mb-2" />
                            <p className="text-slate-700 italic mb-6">
                                "Was looking for a good competition platform and found Wisdom Abacus. Very professional approach to conducting exams."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">AM</div>
                                <div>
                                    <p className="font-bold text-sm text-[#121212]">Amit M.</p>
                                    <p className="text-xs text-slate-400">Parent, Grade 4</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
