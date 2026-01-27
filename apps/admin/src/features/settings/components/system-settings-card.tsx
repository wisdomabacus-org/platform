
import { useState, useEffect } from 'react';
import { useSystemSettings, useUpdateSystemSettings } from '../hooks/use-settings';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Loader2, Save } from 'lucide-react';

export function SystemSettingsCard() {
    const { data: settings, isLoading } = useSystemSettings();
    const { mutate: updateSettings, isPending } = useUpdateSystemSettings();

    const [platformName, setPlatformName] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowRegistrations, setAllowRegistrations] = useState(true);

    // Sync state when data loads
    useEffect(() => {
        if (settings) {
            setPlatformName(settings.platformName);
            setSupportEmail(settings.supportEmail);
            setMaintenanceMode(settings.maintenanceMode);
            setAllowRegistrations(settings.allowRegistrations);
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings({
            platformName,
            supportEmail,
            maintenanceMode,
            allowRegistrations
        });
    };

    if (isLoading) {
        return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage global platform configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                        id="platformName"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        placeholder="Wisdom Abacus Admin"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                        id="supportEmail"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="support@example.com"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Temporarily disable user access for maintenance.
                        </p>
                    </div>
                    <Switch
                        checked={maintenanceMode}
                        onCheckedChange={setMaintenanceMode}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Allow Registrations</Label>
                        <p className="text-sm text-muted-foreground">
                            Enable new user registrations on the platform.
                        </p>
                    </div>
                    <Switch
                        checked={allowRegistrations}
                        onCheckedChange={setAllowRegistrations}
                    />
                </div>

                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </CardContent>
        </Card>
    );
}
