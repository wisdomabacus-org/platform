import Link from "next/link";
import {
    Trophy, Target,
    ArrowRight, Sparkles, BrainCircuit, History
} from "lucide-react";

// ----------------------------------------------------------------------
// 1. UI PRIMITIVES (Internal for Stability)
// ----------------------------------------------------------------------

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

const Badge = ({ children, className }: any) => (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors", className)}>
        {children}
    </div>
);

const Button = ({ children, className = "", variant = "primary", size = "default", ...props }: any) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95";
    const variants: any = {
        primary: "bg-[#121212] text-white hover:bg-slate-800 shadow-md hover:shadow-lg",
        outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
        orange: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-100",
    };
    const sizes: any = {
        default: "h-12 px-6",
        lg: "h-14 px-8 text-lg",
    };
    return (
        <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
            {children}
        </button>
    );
};

// ----------------------------------------------------------------------
// 2. PAGE SECTIONS
// ----------------------------------------------------------------------

const AboutHero = () => {
    return (
        <section className="pt-24 pb-16 bg-white">
            <div className="w-full max-w-3xl mx-auto px-6 text-center">

                <Badge className="bg-orange-50 text-orange-600 border-orange-100 mb-8">
                    <Sparkles className="h-3 w-3" />
                    Est. 2012
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold text-[#121212] leading-[1.15] mb-6 tracking-tight">
                    We are building the <br />
                    <span className="text-orange-600">next generation</span> of thinkers.
                </h1>

                <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
                    Wisdom Abacus Academy isn't just about math. It's about unlocking the
                    full potential of the human brain through the ancient art of Abacus
                    and modern teaching methodologies.
                </p>

            </div>
        </section>
    );
};

const OurStory = () => {
    return (
        <section className="py-16 bg-white">
            <div className="w-full max-w-3xl mx-auto px-6">
                <div className="prose prose-lg prose-slate text-slate-600">
                    <h3 className="text-2xl font-bold text-[#121212] mb-6">Our Story</h3>
                    <p className="mb-6">
                        It started 12 years ago with a simple observation: students were fearing numbers.
                        Mathematics, which is the language of the universe, was becoming a source of anxiety
                        rather than joy.
                    </p>
                    <p className="mb-6">
                        We founded <strong>Wisdom Abacus Academy</strong> with a mission to change that narrative.
                        Starting with just 5 students in a small classroom, we focused on one thing:
                        <strong> Confidence</strong>. We realized that when a child solves a complex calculation
                        mentally in seconds, it doesn't just improve their math score; it transforms their self-belief.
                    </p>
                    <p>
                        Today, with over 5,000 students trained and a digital platform reaching across the nation,
                        our core philosophy remains the same: <em>Education is not about filling a bucket,
                            but lighting a fire.</em>
                    </p>
                </div>

                {/* Simple Stats Strip */}
                <div className="grid grid-cols-3 gap-8 py-12 mt-12 border-y border-slate-100">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#121212]">12+</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Years</div>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <div className="text-3xl font-bold text-orange-600">5k+</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#121212]">40+</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Events</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CoreValues = () => {
    const values = [
        {
            icon: BrainCircuit,
            title: "Cognitive Development",
            desc: "We focus on whole-brain development, enhancing visualization and memory, not just calculation speed."
        },
        {
            icon: Trophy,
            title: "Competitive Spirit",
            desc: "Through national-level championships, we teach students to handle pressure and celebrate success."
        },
        {
            icon: Target,
            title: "Accuracy & Focus",
            desc: "Our rigorous curriculum is designed to eliminate silly mistakes and build laser-sharp concentration."
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="w-full max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#121212]">What Drives Us</h2>
                    <p className="text-slate-500 mt-2">The principles that shape our curriculum.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <v.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#121212] mb-3">{v.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const JoinCTA = () => {
    return (
        <section className="py-24 bg-white">
            <div className="w-full max-w-3xl mx-auto px-6 text-center">
                <div className="p-12 rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                        <History className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#121212] mb-4">
                        Be Part of the Legacy
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Whether you want to enroll your child or join us as a franchise partner,
                        we welcome you to the Wisdom family.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact-us">
                            <Button variant="orange">
                                Contact Us
                            </Button>
                        </Link>
                        <Link href="/courses">
                            <Button variant="outline">
                                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ----------------------------------------------------------------------
// 3. MAIN PAGE EXPORT
// ----------------------------------------------------------------------

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-orange-500 selection:text-white">
            <AboutHero />
            <OurStory />
            <CoreValues />
            <JoinCTA />
        </main>
    );
}