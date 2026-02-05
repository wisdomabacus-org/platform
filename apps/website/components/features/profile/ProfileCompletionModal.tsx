"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, User, Phone, MapPin } from "lucide-react";
import { useProfileModal } from "@/stores/modal-store";
import { useCurrentUser } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-users";
import { ProfileInput } from "./profile-ui";
import { toast } from "sonner";

export function ProfileCompletionModal() {
    const { isOpen, onClose } = useProfileModal();
    const { user, refetch } = useCurrentUser();
    const { mutate: updateProfile, isPending, error: mutationError } = useUpdateProfile();

    const [formData, setFormData] = useState({
        parentName: "",
        studentName: "",
        studentGrade: 1,
        schoolName: "",
        city: "",
        state: "",
        phone: "",
        dateOfBirth: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                parentName: user.parentName || "",
                studentName: user.studentName || "",
                studentGrade: user.studentGrade || 1,
                schoolName: user.schoolName || "",
                city: user.city || "",
                state: user.state || "",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
            });
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (mutationError) {
            const error = mutationError as any;
            const validationErrors = error?.details;

            if (validationErrors && Array.isArray(validationErrors)) {
                const errors: Record<string, string> = {};
                validationErrors.forEach((err: { field: string; message: string }) => {
                    errors[err.field] = err.message;
                });
                setFieldErrors(errors);
            }
        }
    }, [mutationError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'studentGrade' ? parseInt(value) : value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.studentName) errors.studentName = "Student Name is required";
        if (!formData.schoolName) errors.schoolName = "School Name is required";
        if (!formData.parentName) errors.parentName = "Parent Name is required";
        if (!formData.phone) errors.phone = "Phone Number is required";
        if (!formData.city) errors.city = "City is required";
        if (!formData.state) errors.state = "State is required";
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of Birth is required";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProfile = () => {
        if (!validateForm()) return;

        updateProfile(formData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                refetch(); // Refresh user data
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display font-bold text-slate-900">
                        Complete Your Profile
                    </DialogTitle>
                    <DialogDescription>
                        Please provide the following details to proceed with enrollment.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Student Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-500" /> Student Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileInput
                                label="Student Name"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                placeholder="Enter student name"
                                error={fieldErrors.studentName}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Grade</label>
                                <select
                                    name="studentGrade"
                                    value={formData.studentGrade}
                                    onChange={handleInputChange}
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                                >
                                    <option value={0}>UKG</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                                        <option key={grade} value={grade}>Grade {grade}</option>
                                    ))}
                                </select>
                            </div>
                            <ProfileInput
                                label="School Name"
                                name="schoolName"
                                value={formData.schoolName}
                                onChange={handleInputChange}
                                placeholder="Enter school name"
                                error={fieldErrors.schoolName}
                            />
                            <ProfileInput
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                error={fieldErrors.dateOfBirth}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Parent Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-500" /> Parent & Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileInput
                                label="Parent Name"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleInputChange}
                                placeholder="Enter parent name"
                                error={fieldErrors.parentName}
                            />
                            <ProfileInput
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 XXXXX XXXXX"
                                error={fieldErrors.phone}
                            />
                            <ProfileInput
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                error={fieldErrors.city}
                            />
                            <ProfileInput
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Enter state"
                                error={fieldErrors.state}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={isPending}
                            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> Save & Continue
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
