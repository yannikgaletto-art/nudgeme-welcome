import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NudgeLogo from "@/components/NudgeLogo";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBegin = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/mood");
    }, 300);
  };

  return (
    <main className={cn(
      "min-h-screen flex flex-col items-center justify-center px-6 relative transition-opacity duration-300",
      isExiting && "opacity-0"
    )} style={{ backgroundColor: "#F5E6D3" }}>
      {/* Settings Icon */}
      <button
        onClick={() => navigate("/settings")}
        className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 opacity-0 animate-fade-in animation-delay-800"
        style={{ color: "rgba(44, 62, 80, 0.6)" }}
        aria-label="Settings"
      >
        <Settings size={24} />
      </button>
      {/* Centered Content Stack */}
      <div className="flex flex-col items-center max-w-[400px] w-full">
        {/* Logo */}
        <div className="opacity-0 animate-fade-in animation-delay-0">
          <NudgeLogo />
        </div>

        {/* App Name */}
        <h1 className="mt-8 font-display font-semibold text-[40px] md:text-[48px] text-foreground tracking-tight leading-tight opacity-0 animate-fade-in animation-delay-200">
          NudgeMe
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-base text-muted-foreground tracking-wide opacity-0 animate-fade-in animation-delay-400">
          Take a moment with yourself
        </p>

        {/* Primary CTA Button */}
        <div className="mt-16 w-full flex justify-center opacity-0 animate-fade-in-up animation-delay-600">
          <Button
            variant="nudge"
            size="cta"
            onClick={handleBegin}
            aria-label="Begin mindfulness session"
          >
            Let's begin
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center opacity-0 animate-fade-in animation-delay-800">
        <p className="text-[11px] text-footer opacity-70">
          Made with care for your peace of mind
        </p>
      </footer>
    </main>
  );
};

export default Index;
