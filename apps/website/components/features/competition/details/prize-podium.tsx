import { Trophy, Medal, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EMOJIS } from "@/lib/constants/emojis";
import type { PrizeDetails } from "@/types/competition";

interface PrizePodiumProps {
    prizes?: PrizeDetails[];
}

export const PrizePodium = ({ prizes = [] }: PrizePodiumProps) => {
    // Sort prizes by rank
    const sortedPrizes = [...prizes].sort((a, b) => a.rank - b.rank);

    const rank1 = sortedPrizes.find(p => p.rank === 1);
    const rank2 = sortedPrizes.find(p => p.rank === 2);
    const rank3 = sortedPrizes.find(p => p.rank === 3);
    const otherPrizes = sortedPrizes.filter(p => p.rank > 3);

    // Calculate total worth
    const totalWorth = sortedPrizes.reduce((sum, p) => sum + (p.worth || 0), 0);

    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Gift className="h-6 w-6 text-orange-600" /> Prizes & Rewards
            </h2>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-12">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                        Prizes Worth <span className="text-orange-600">₹{totalWorth > 0 ? totalWorth.toLocaleString() : '21,000+'}</span>
                    </h3>
                    <p className="text-slate-500 text-sm">Rewards that inspire greatness.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    {/* Rank 2 */}
                    {rank2 && (
                        <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Runner Up
                            </div>
                            <div className="text-5xl mb-4 mt-2">{EMOJIS.PRIZES.WATCH}</div>
                            <h4 className="font-bold text-slate-900">{rank2.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">Worth ₹{(rank2.worth || 0).toLocaleString()}</p>
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">Rank 2</Badge>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 (Center/Big) */}
                    {rank1 && (
                        <div className="order-1 md:order-2 bg-gradient-to-b from-orange-50 to-white border-2 border-orange-100 rounded-3xl p-8 text-center shadow-xl relative transform md:-translate-y-4 z-10">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-2">
                                <Trophy className="h-3 w-3" /> Champion
                            </div>
                            <div className="text-7xl mb-4 mt-4">{EMOJIS.PRIZES.CYCLE}</div>
                            <h4 className="font-bold text-xl text-slate-900">{rank1.title}</h4>
                            <p className="text-orange-600 font-bold text-sm mt-1">Worth ₹{(rank1.worth || 0).toLocaleString()}</p>
                            <div className="mt-4 pt-4 border-t border-orange-100">
                                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                                    <Medal className="h-4 w-4 text-yellow-500" /> {rank1.description}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 */}
                    {rank3 && (
                        <div className="order-3 md:order-3 bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                2nd Runner Up
                            </div>
                            <div className="text-5xl mb-4 mt-2">{EMOJIS.PRIZES.ART_KIT}</div>
                            <h4 className="font-bold text-slate-900">{rank3.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">Worth ₹{(rank3.worth || 0).toLocaleString()}</p>
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">Rank 3</Badge>
                            </div>
                        </div>
                    )}
                </div>

                {/* Consolation Prizes List */}
                {otherPrizes.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {otherPrizes.map((prize, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg">
                                    {prize.type === 'cash' ? EMOJIS.PRIZES.CASH : EMOJIS.PRIZES.BAG}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Rank {prize.rank}</p>
                                    <p className="text-sm font-bold text-slate-900">{prize.title}</p>
                                    <p className="text-[10px] text-slate-500">Worth ₹{(prize.worth || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Everyone Wins */}
                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                    <p className="text-sm font-medium text-slate-600 mb-3">For Every Single Participant</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 py-1.5 px-3">
                            {EMOJIS.CERTIFICATES.OFFICIAL} Official Certificate
                        </Badge>
                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 py-1.5 px-3">
                            {EMOJIS.CERTIFICATES.MEMORANDUM} Memorandum
                        </Badge>
                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 py-1.5 px-3">
                            {EMOJIS.CERTIFICATES.MEDAL} Silver Medal (Top 200)
                        </Badge>
                    </div>
                </div>
            </div>
        </section>
    );
};
