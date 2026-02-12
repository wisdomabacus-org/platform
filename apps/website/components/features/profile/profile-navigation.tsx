import { User, Trophy, Settings, LogOut, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "profile" | "competitions" | "mock-tests" | "settings";

interface ProfileNavigationProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    handleLogout?: () => void;
}

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "mock-tests", label: "Mock Tests", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
] as const;

export const ProfileSidebar = ({ activeTab, setActiveTab, handleLogout }: ProfileNavigationProps) => {
    return (
        <nav className="hidden lg:col-span-3 lg:flex flex-col gap-2">
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabId)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200",
                            activeTab === item.id
                                ? "bg-orange-50 text-orange-700"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-orange-600" : "text-slate-400")} />
                            {item.label}
                        </div>
                        {activeTab === item.id && <ChevronRight className="h-4 w-4 text-orange-400" />}
                    </button>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mt-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export const ProfileMobileNav = ({ activeTab, setActiveTab }: ProfileNavigationProps) => {
    return (
        <div className="lg:hidden col-span-1 mb-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            <div className="flex gap-3 min-w-max">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabId)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border shadow-sm",
                            activeTab === item.id
                                ? "bg-[#121212] text-white border-[#121212]"
                                : "bg-white text-slate-600 border-slate-200"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
