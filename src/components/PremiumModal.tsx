import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  icon: string;
  title: string;
  description: string;
  benefits?: string[];
  upgradeText?: string;
  cancelText?: string;
}

const PremiumModal = ({
  isOpen,
  onClose,
  onUpgrade,
  icon,
  title,
  description,
  benefits,
  upgradeText = "Upgrade Now",
  cancelText = "Maybe Later",
}: PremiumModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-[380px] rounded-3xl p-8 relative animate-scale-in"
        )}
        style={{
          backgroundColor: "white",
          border: "2px solid rgba(255, 215, 0, 0.3)",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ color: "rgba(44, 62, 80, 0.5)" }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <span className="text-6xl">{icon}</span>
        </div>

        {/* Title */}
        <h2
          className="text-center text-2xl font-medium mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="text-center text-base leading-relaxed mb-4"
          style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
        >
          {description}
        </p>

        {/* Benefits */}
        {benefits && benefits.length > 0 && (
          <div className="mb-6 space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "#22c55e" }}>✓</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3 mt-6">
          <button
            onClick={onUpgrade}
            className="w-full h-[52px] rounded-full font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] premium-shimmer"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              color: "white",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 4px 16px rgba(255, 215, 0, 0.3)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            {upgradeText}
          </button>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full font-medium text-base transition-all duration-200 hover:bg-gray-100"
            style={{
              backgroundColor: "transparent",
              color: "#6B6B6B",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
