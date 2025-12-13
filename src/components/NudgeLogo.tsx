const NudgeLogo = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-nudge-bounce"
      aria-hidden="true"
    >
      {/* Large circle being nudged */}
      <circle
        cx="48"
        cy="40"
        r="22"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-foreground animate-nudge-circle"
      />
      
      {/* Small nudging element - curved finger/shape */}
      <path
        d="M12 40 Q18 32, 22 40 Q18 48, 12 40"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-foreground"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Motion lines suggesting the nudge */}
      <path
        d="M26 36 L30 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-foreground opacity-60"
      />
      <path
        d="M26 40 L32 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-foreground opacity-80"
      />
      <path
        d="M26 44 L30 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-foreground opacity-60"
      />
    </svg>
  );
};

export default NudgeLogo;
