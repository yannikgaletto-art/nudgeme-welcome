import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const PremiumBadge = ({ size = "sm", showIcon = true, className }: PremiumBadgeProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg font-bold premium-shimmer",
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        color: "white",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
      }}
    >
      {showIcon && (size === "sm" ? <Lock size={10} /> : <Sparkles size={12} />)}
      Premium
    </div>
  );
};

export default PremiumBadge;
