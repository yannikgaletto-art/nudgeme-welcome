interface IconProps {
  seconds: number;
  className?: string;
}

// Nose icon with arrows pointing inward (for inhale)
export const NoseInhaleIcon = ({ seconds, className = "" }: IconProps) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <span className="text-3xl font-bold" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);

// Mouth icon with arrows pointing outward (for exhale)
export const MouthExhaleIcon = ({ seconds, pursed = false, className = "" }: IconProps & { pursed?: boolean }) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Face outline hint */}
      <ellipse cx="32" cy="24" rx="20" ry="16" stroke="#2C3E50" strokeWidth="2" fill="none" opacity="0.3" />
      {/* Mouth */}
      {pursed ? (
        // Pursed lips (small O shape)
        <ellipse cx="32" cy="24" rx="6" ry="8" stroke="#2C3E50" strokeWidth="2" fill="none" />
      ) : (
        // Open mouth
        <ellipse cx="32" cy="24" rx="10" ry="8" stroke="#2C3E50" strokeWidth="2" fill="none" />
      )}
      {/* Left arrow pointing out */}
      <path d="M12 20 L2 24 L12 28" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="12" y1="24" x2="20" y2="24" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
      {/* Right arrow pointing out */}
      <path d="M52 20 L62 24 L52 28" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="52" y1="24" x2="44" y2="24" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="text-3xl font-bold" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);

// Finger up icon (for hold)
export const HoldIcon = ({ seconds, className = "" }: IconProps) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Index finger pointing up */}
      <path
        d="M24 4 L24 32"
        stroke="#2C3E50"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Finger tip */}
      <circle cx="24" cy="4" r="4" fill="#2C3E50" />
      {/* Folded fingers (simplified) */}
      <path
        d="M16 36 C16 32 18 30 20 30 L28 30 C30 30 32 32 32 36 L32 48 C32 52 28 54 24 54 C20 54 16 52 16 48 Z"
        stroke="#2C3E50"
        strokeWidth="2"
        fill="none"
      />
      {/* Thumb hint */}
      <path
        d="M12 38 C8 38 6 42 8 46"
        stroke="#2C3E50"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
    <span className="text-3xl font-bold" style={{ color: "#2C3E50" }}>{seconds}</span>
  </div>
);
