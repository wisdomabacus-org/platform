
export interface SystemSettings {
    platformName: string;
    maintenanceMode: boolean;
    supportEmail: string;
    allowRegistrations: boolean;
}

export interface AdminProfile {
    id: string;
    username: string;
    lastLogin: Date;
    role: string;
}
