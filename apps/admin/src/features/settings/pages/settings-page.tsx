
import { SystemSettingsCard } from '../components/system-settings-card';
import { AdminProfileCard } from '../components/admin-profile-card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="scrollbar-hide flex h-screen max-h-screen w-full flex-col gap-y-6 overflow-y-scroll px-8 py-6">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage system configuration and your profile.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <SystemSettingsCard />
                <AdminProfileCard />
            </div>
        </div>
    );
}
