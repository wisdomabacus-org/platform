
import { useState, useEffect } from 'react';
import { User } from '../../types/user.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useUpdateProfile } from '../../hooks/use-users';
import { Loader2, Save } from 'lucide-react';

interface Props {
    user: User;
}

export function UserProfileTab({ user }: Props) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const [form, setForm] = useState({
        studentName: user.studentName || '',
        parentName: user.parentName || '',
        dateOfBirth: user.dateOfBirth || '',
        studentGrade: user.studentGrade || '',
        phone: user.phone || '',
        schoolName: user.schoolName || '',
        city: user.city || '',
        state: user.state || '',
    });

    useEffect(() => {
        setForm({
            studentName: user.studentName || '',
            parentName: user.parentName || '',
            dateOfBirth: user.dateOfBirth || '',
            studentGrade: user.studentGrade || '',
            phone: user.phone || '',
            schoolName: user.schoolName || '',
            city: user.city || '',
            state: user.state || '',
        });
    }, [user]);

    const handleSave = () => {
        updateProfile({ id: user.id, data: form });
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Student Name</label>
                                <Input
                                    value={form.studentName}
                                    onChange={e => handleChange('studentName', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
                                <Input
                                    value={form.parentName}
                                    onChange={e => handleChange('parentName', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                                <Input
                                    type="date"
                                    value={form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : ''}
                                    onChange={e => handleChange('dateOfBirth', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Grade</label>
                                <Input
                                    value={form.studentGrade}
                                    onChange={e => handleChange('studentGrade', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact & Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <Input
                                    value={user.email || ''}
                                    disabled
                                    className="mt-1 bg-muted/50"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Email cannot be edited</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <Input
                                    value={form.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">School</label>
                                <Input
                                    value={form.schoolName}
                                    onChange={e => handleChange('schoolName', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">City</label>
                                    <Input
                                        value={form.city}
                                        onChange={e => handleChange('city', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">State</label>
                                    <Input
                                        value={form.state}
                                        onChange={e => handleChange('state', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">UID</div>
                            <div className="text-sm font-mono">{user.uid}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Provider</div>
                            <div className="text-sm capitalize">{user.authProvider}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Created At</div>
                            <div className="text-sm">{user.createdAt.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                            <div className="text-sm">{user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                    )}
                </Button>
            </div>
        </div>
    );
}
