interface StatusBadgeProps {
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusConfig = {
    pending: { 
      label: "Menunggu", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200" 
    },
    confirmed: { 
      label: "Dikonfirmasi", 
      color: "bg-blue-100 text-blue-800 border-blue-200" 
    },
    in_progress: { 
      label: "Sedang Diproses", 
      color: "bg-purple-100 text-purple-800 border-purple-200" 
    },
    completed: { 
      label: "Selesai", 
      color: "bg-green-100 text-green-800 border-green-200" 
    },
    cancelled: { 
      label: "Dibatalkan", 
      color: "bg-red-100 text-red-800 border-red-200" 
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
}