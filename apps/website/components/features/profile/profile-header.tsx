import { User } from "@/types/auth";

interface ProfileHeaderProps {
    user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    return (
        <div className="bg-[#121212] pt-12 pb-32 border-b border-white/5">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white/10 shadow-2xl shrink-0">
                        {user.studentName ? user.studentName.substring(0, 2).toUpperCase() : 'WA'}
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">{user.studentName || 'Student'}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                            <span className="font-bold text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 shadow-sm">
                                Grade {user.studentGrade || 'N/A'}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-slate-600 hidden md:block" />
                            <span className="text-slate-400 font-medium flex items-center gap-2">
                                <span className="opacity-50">ID:</span> {user.uid || user.id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
