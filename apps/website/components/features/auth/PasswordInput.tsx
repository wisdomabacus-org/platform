"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  showStrengthIndicator?: boolean;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  disabled = false,
  autoComplete = "current-password",
  showStrengthIndicator = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  // Simple password strength calculation
  const getPasswordStrength = (password: string): {
    strength: number;
    label: string;
    color: string;
  } => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;

    if (strength <= 25)
      return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 50)
      return { strength, label: "Fair", color: "bg-orange-500" };
    if (strength <= 75)
      return { strength, label: "Good", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = showStrengthIndicator
    ? getPasswordStrength(value)
    : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`pr-10 border-gray-300 ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>

      {/* Password Strength Indicator */}
      {showStrengthIndicator && value && passwordStrength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  level <= passwordStrength.strength / 25
                    ? passwordStrength.color
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p
            className={`text-xs ${
              passwordStrength.strength <= 25
                ? "text-red-600"
                : passwordStrength.strength <= 50
                  ? "text-orange-600"
                  : passwordStrength.strength <= 75
                    ? "text-yellow-600"
                    : "text-green-600"
            }`}
          >
            Password strength: {passwordStrength.label}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
