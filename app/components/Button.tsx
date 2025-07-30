import { motion } from "framer-motion";
// React exports types like `ReactNode` only for type annotations. Importing
// them as values at runtime causes errors because CommonJS modules do not
// expose these named exports. Use `import type` to pull in the type-only
// definitions so they are erased during compilation.
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  size = "md",
  disabled = false,
  loading = false,
  icon,
  className = ""
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
