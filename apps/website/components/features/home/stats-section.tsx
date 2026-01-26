export const StatsSection = () => {
    return (
        <section className="py-8 border-y border-slate-100 bg-slate-50/50">
            <div className="w-full lg:w-3/4 mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
                    {[
                        { label: "Years of Teaching", value: "12+" },
                        { label: "Students Trained", value: "5,000+" },
                        { label: "Competitions Held", value: "40+" },
                        { label: "Cities Reached", value: "100+" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-2">
                            <span className="text-2xl md:text-3xl font-bold text-[#121212]">{stat.value}</span>
                            <span className="text-xs md:text-sm text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
