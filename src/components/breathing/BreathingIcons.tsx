import { Wind, Pause } from "lucide-react";

interface IconProps {
  seconds: number;
  className?: string;
}

// Nose icon with arrows pointing inward (for inhale)
export const NoseInhaleIcon = ({ seconds, className = "" }: IconProps) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nose outline */}
      <path
        d="M32 8 C32 8 28 20 24 28 C20 36 16 40 16 40 L48 40 C48 40 44 36 40 28 C36 20 32 8 32 8Z"
        stroke="#2C3E50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Nostrils */}
      <ellipse cx="26" cy="36" rx="4" ry="3" stroke="#2C3E50" strokeWidth="2" fill="none" />
      <ellipse cx="38" cy="36" rx="4" ry="3" stroke="#2C3E50" strokeWidth="2" fill="none" />
      {/* Left arrow pointing in */}
      <path d="M8 32 L18 36 L8 40" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="2" y1="36" x2="18" y2="36" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
      {/* Right arrow pointing in */}
      <path d="M56 32 L46 36 L56 40" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="62" y1="36" x2="46" y2="36" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="text-3xl font-semibold tabular-nums" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);

// Wind icon for exhale (clearer and more universal)
export const ExhaleIcon = ({ seconds, className = "" }: IconProps) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <Wind size={40} strokeWidth={2} style={{ color: "#2C3E50" }} />
    <span className="text-3xl font-semibold tabular-nums" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);

// Pause icon (for hold) - universally recognized
export const HoldIcon = ({ seconds, className = "" }: IconProps) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <Pause size={40} strokeWidth={2} style={{ color: "#2C3E50" }} />
    <span className="text-3xl font-semibold tabular-nums" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);
