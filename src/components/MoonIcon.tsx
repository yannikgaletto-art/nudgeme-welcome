const MoonIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
      aria-hidden="true"
    >
      <path
        d="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C20.3333 12 20.6667 12.0167 21 12.05C19.1667 13.25 18 15.3333 18 17.5C18 21.0899 20.9101 24 24.5 24C25.1 24 25.7 23.9167 26.25 23.75C26.75 22.5833 27 21.3333 27 20C27 16.5 25 13.5 22 12.2C22.8333 12.0667 23.6667 12 24.5 12C26.5 12 28 13.5 28 15.5V20Z"
        fill="currentColor"
        className="text-accent/40"
      />
      <circle
        cx="20"
        cy="20"
        r="17"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent/20"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
    </svg>
  );
};

export default MoonIcon;
