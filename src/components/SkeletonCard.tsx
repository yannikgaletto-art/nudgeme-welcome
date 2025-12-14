import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "quote" | "saved" | "category";
  className?: string;
}

const SkeletonCard = ({ variant = "quote", className }: SkeletonCardProps) => {
  if (variant === "quote") {
    return (
      <div
        className={cn(
          "w-full max-w-[380px] min-h-[420px] rounded-3xl flex flex-col p-12 relative overflow-hidden",
          className
        )}
        style={{ backgroundColor: "white", boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)" }}
        aria-label="Loading quote"
      >
        {/* Category badge skeleton */}
        <div className="absolute top-4 right-4 w-16 h-6 rounded-full bg-gray-200 animate-shimmer" />
        
        {/* Quote lines */}
        <div className="flex-1 flex flex-col gap-3 mt-8">
          <div className="h-5 w-[90%] rounded-lg bg-gray-200 animate-shimmer" />
          <div className="h-5 w-full rounded-lg bg-gray-200 animate-shimmer" style={{ animationDelay: "100ms" }} />
          <div className="h-5 w-[85%] rounded-lg bg-gray-200 animate-shimmer" style={{ animationDelay: "200ms" }} />
          <div className="h-5 w-[75%] rounded-lg bg-gray-200 animate-shimmer" style={{ animationDelay: "300ms" }} />
        </div>
        
        {/* Author skeleton */}
        <div className="h-4 w-24 rounded-lg bg-gray-200 mt-8 animate-shimmer" style={{ animationDelay: "400ms" }} />
        
        {/* Action buttons skeleton */}
        <div className="flex gap-4 mt-8">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: "500ms" }} />
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: "600ms" }} />
        </div>
      </div>
    );
  }

  if (variant === "saved") {
    return (
      <div
        className={cn(
          "w-full min-h-[140px] rounded-[20px] p-6 relative overflow-hidden",
          className
        )}
        style={{ backgroundColor: "white", border: "1.5px solid rgba(44, 62, 80, 0.2)" }}
        aria-label="Loading saved quote"
      >
        {/* Badge skeleton */}
        <div className="absolute top-4 right-4 w-16 h-5 rounded-full bg-gray-200 animate-shimmer" />
        
        {/* Text lines */}
        <div className="flex flex-col gap-2 pr-20">
          <div className="h-4 w-full rounded bg-gray-200 animate-shimmer" />
          <div className="h-4 w-[85%] rounded bg-gray-200 animate-shimmer" style={{ animationDelay: "100ms" }} />
        </div>
        
        {/* Author */}
        <div className="h-3 w-20 rounded bg-gray-200 mt-3 animate-shimmer" style={{ animationDelay: "200ms" }} />
        
        {/* Actions */}
        <div className="flex gap-2 mt-4 justify-end">
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: "300ms" }} />
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    );
  }

  if (variant === "category") {
    return (
      <div
        className={cn(
          "aspect-square rounded-[20px] flex flex-col items-center justify-center p-6 relative overflow-hidden",
          className
        )}
        style={{ backgroundColor: "white", border: "2px solid rgba(44, 62, 80, 0.2)" }}
        aria-label="Loading category"
      >
        {/* Icon circle */}
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-shimmer" />
        
        {/* Category name */}
        <div className="h-4 w-[60%] rounded bg-gray-200 mt-4 animate-shimmer" style={{ animationDelay: "100ms" }} />
        
        {/* Quote count */}
        <div className="h-3 w-[40%] rounded bg-gray-200 mt-2 animate-shimmer" style={{ animationDelay: "200ms" }} />
      </div>
    );
  }

  return null;
};

export default SkeletonCard;
