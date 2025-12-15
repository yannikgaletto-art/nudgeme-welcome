import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Home, Heart, Users, UserPlus, Activity, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends" | "sport";

const scenarioConfig: Record<DoGoodScenario, { icon: LucideIcon; label: string }> = {
  office: { icon: Briefcase, label: "Office" },
  home: { icon: Home, label: "At Home" },
  date: { icon: Heart, label: "On a Date" },
  stranger: { icon: Users, label: "With a Stranger" },
  friends: { icon: UserPlus, label: "With Friends" },
  sport: { icon: Activity, label: "During Sport" },
};

const CheckInIntro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = (location.state?.scenario as DoGoodScenario) || "office";
  
  const config = scenarioConfig[scenario] || scenarioConfig.office;
  const IconComponent = config.icon;

  const handleReady = () => {
    navigate("/check-in/countdown", { state: { scenario } });
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-between px-6 py-10"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Top section with title and badge */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Title */}
        <h1
          className={cn(
            "text-[28px] md:text-[32px] font-semibold text-center leading-[1.3] tracking-[-0.4px]",
            "opacity-0"
          )}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
            animation: "fade-in 400ms ease-out forwards",
          }}
        >
          Let's go to your check-in
        </h1>

        {/* Scenario badge */}
        <div
          className={cn(
            "mt-8 inline-flex items-center gap-3 px-8 py-3.5 rounded-full",
            "opacity-0"
          )}
          style={{
            backgroundColor: "rgba(167, 196, 188, 0.2)",
            border: "2px solid #A7C4BC",
            animation: "scale-fade-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            animationDelay: "200ms",
          }}
        >
          <IconComponent
            size={24}
            strokeWidth={2}
            style={{ color: "#2C3E50" }}
          />
          <span
            className="text-xl font-semibold"
            style={{ color: "#2C3E50" }}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleReady}
        className={cn(
          "w-full max-w-[400px] h-14 rounded-full text-base font-semibold",
          "transition-all duration-200 hover:scale-[1.05]",
          "opacity-0"
        )}
        style={{
          backgroundColor: "#2C3E50",
          color: "white",
          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          animation: "slide-up-fade 400ms ease-out forwards",
          animationDelay: "500ms",
        }}
      >
        Are you ready?
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
};

export default CheckInIntro;
