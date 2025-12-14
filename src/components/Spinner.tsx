import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "navy" | "white";
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-3",
  lg: "w-10 h-10 border-4",
};

const Spinner = ({ size = "md", className, color = "navy" }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeClasses[size],
        color === "navy" ? "border-[#2C3E50]" : "border-white",
        "border-t-transparent",
        className
      )}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
