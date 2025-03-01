// app/(auth)/components/PasswordInput.tsx
"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`border-blue-700 bg-blue-900/50 text-blue-100 placeholder:text-blue-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
      >
        {showPassword ? (
          <FaEyeSlash className="h-4 w-4" />
        ) : (
          <FaEye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
