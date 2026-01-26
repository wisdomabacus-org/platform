import { User, Phone, Mail, MapPin, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileInput, ProfileButton } from "./profile-ui";
import { User as UserType } from "@/types/auth";
import { useUpdateProfile } from "@/hooks/use-users";

interface ProfileTabProps {
    user: UserType;
}

export const ProfileTab = ({ user }: ProfileTabProps) => {
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
    }, [user]);

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

    const handleSaveProfile = () => {
        setFieldErrors({});
        updateProfile(formData);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Student Info */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Student Details</h3>
                        <p className="text-xs text-slate-500 font-medium">Personal academic information</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <ProfileInput
                        label="Student Name"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter student name"
                        error={fieldErrors.studentName}
                    />
                    <ProfileInput
                        label="School Name"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        placeholder="Enter school name"
                        error={fieldErrors.schoolName}
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Grade</label>
                        <select
                            name="studentGrade"
                            value={formData.studentGrade}
                            onChange={handleInputChange}
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                        >
                            <option value={0}>UKC</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                                <option key={grade} value={grade}>Grade {grade}</option>
                            ))}
                        </select>
                    </div>
                    <ProfileInput
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        error={fieldErrors.dateOfBirth}
                    />
                    <ProfileInput label="Student ID" value={user.uid || user.id} readOnly />
                </div>
            </section>

            <div className="h-px bg-slate-100 w-full" />

            {/* Parent Info */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Parent Contact</h3>
                        <p className="text-xs text-slate-500 font-medium">Emergency contact details</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <ProfileInput
                        label="Parent Name"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        icon={User}
                        placeholder="Enter parent name"
                        error={fieldErrors.parentName}
                    />
                    <ProfileInput
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        icon={Phone}
                        placeholder="+91 XXXXX XXXXX"
                        error={fieldErrors.phone}
                    />
                    <ProfileInput
                        label="Email Address"
                        value={user.email || "Not provided"}
                        icon={Mail}
                        readOnly
                    />
                    <ProfileInput
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        icon={MapPin}
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
            </section>

            <div className="flex justify-end pt-6 border-t border-slate-100">
                <ProfileButton
                    className="w-full md:w-auto"
                    onClick={handleSaveProfile}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </>
                    )}
                </ProfileButton>
            </div>
        </div>
    );
};
