import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "danger";
}

export default function Button({
  loading = false,
  icon,
  size = "md",
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" color="text-white" /> : icon}
      <span>{children}</span>
    </button>
  );
}
