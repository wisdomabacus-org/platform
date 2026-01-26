"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/use-auth";

import { ProfileCard } from "@/components/features/profile/profile-ui";
import { ProfileHeader } from "@/components/features/profile/profile-header";
import { ProfileSidebar, ProfileMobileNav, TabId } from "@/components/features/profile/profile-navigation";
import { ProfileTab } from "@/components/features/profile/profile-tab";
import { CompetitionsTab } from "@/components/features/profile/competitions-tab";
import { SettingsTab } from "@/components/features/profile/settings-tab";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { refetch } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;
      case "competitions":
        return <CompetitionsTab user={user} />;
      case "settings":
        return <SettingsTab user={user} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* 1. HEADER AREA */}
      <ProfileHeader user={user} />

      {/* 2. CONTENT CONTAINER */}
      <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* NAVIGATION SIDEBAR */}
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

          {/* MOBILE NAVIGATION */}
          <ProfileMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* MAIN CARD */}
          <div className="lg:col-span-9 w-full">
            <ProfileCard className="p-6 md:p-10 min-h-[600px] shadow-xl shadow-slate-200/50 border-0">
              {renderTabContent()}
            </ProfileCard>
          </div>
        </div>
      </div>
    </main>
  );
}