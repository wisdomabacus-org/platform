import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import React from "react";

export const ProfileButton = ({ children, className = "", variant = "primary", disabled = false, ...props }: any) => {
    const variants: any = {
        primary: "bg-[#121212] text-white hover:bg-slate-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
        outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50",
        ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
        danger: "text-red-600 bg-red-50 hover:bg-red-100 border border-red-100",
    };
    return (
        <button
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center rounded-xl font-bold h-11 px-6 text-sm transition-all duration-200 active:scale-[0.98]",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const ProfileInput = ({ label, className, readOnly, icon: Icon, value, onChange, name, type = "text", error, ...props }: any) => (
    <div className="space-y-2">
        {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
        <div className="relative group">
            <input
                disabled={readOnly}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all duration-200",
                    readOnly && "bg-slate-100 text-slate-500 cursor-not-allowed border-transparent focus:ring-0",
                    error && "border-red-300 focus:border-red-500 focus:ring-red-500",
                    Icon && "pl-11",
                    className
                )}
                {...props}
            />
            {Icon && (
                <Icon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            )}
        </div>
        {error && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {error}
            </p>
        )}
    </div>
);

export const ProfileCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm", className)}>
        {children}
    </div>
);
