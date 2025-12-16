import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Check, ArrowLeft } from "lucide-react";
import { BreathingTechnique } from "./BreathingSelection";

const CycleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCycles, setSelectedCycles] = useState(3);

  // Get state from previous page
  const mood = location.state?.mood || "calm";
  const technique: BreathingTechnique | null = location.state?.technique || null;
  const wantsReward = location.state?.wantsReward || false;
  const rewardType = location.state?.rewardType || null;
  const doGoodScenario = location.state?.doGoodScenario || null;

  const handleBack = () => {
    navigate("/breathing-selection", {
      state: { mood, wantsReward, rewardType, doGoodScenario },
    });
  };

  const handleContinue = () => {
    navigate("/breathing", {
      state: {
        mood,
        technique,
        wantsReward,
        rewardType,
        doGoodScenario,
        cycles: selectedCycles,
      },
    });
  };

  const cycleOptions = [
    { count: 2, duration: "~40 sec" },
    { count: 3, duration: "~1 min" },
  ];

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-7 left-5 flex items-center gap-2 text-[#2C3E50] hover:opacity-70 transition-opacity"
        aria-label="Go back to breathing technique selection"
      >
        <ArrowLeft size={24} />
        <span className="text-base font-medium">Back</span>
      </button>
      {/* Title */}
      <h1
        className="text-[32px] font-semibold text-center opacity-0"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2C3E50",
          animation: "fade-in-up 400ms ease-out forwards",
        }}
      >
        How many cycles?
      </h1>

      {/* Subtitle */}
      <p
        className="mt-4 text-base text-center opacity-0"
        style={{
          color: "#6B7280",
          animation: "fade-in-up 400ms ease-out forwards",
          animationDelay: "100ms",
        }}
      >
        Each cycle takes about 20 seconds
      </p>

      {/* Cycle Selection Cards */}
      <div
        className="mt-12 flex gap-6 opacity-0"
        style={{
          animation: "slide-up-fade 500ms ease-out forwards",
          animationDelay: "200ms",
        }}
      >
        {cycleOptions.map(({ count, duration }) => {
          const isSelected = selectedCycles === count;
          return (
            <button
              key={count}
              onClick={() => setSelectedCycles(count)}
              className={cn(
                "relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-[20px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300",
                isSelected 
                  ? "bg-[#2C3E50] border-2 border-[#2C3E50] shadow-lg scale-105" 
                  : "bg-transparent border-2 border-[#2C3E50] hover:bg-[#2C3E50]/5 hover:scale-[1.02]"
              )}
              aria-label={`Select ${count} cycles, approximately ${duration}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 animate-fade-in">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <span
                className={cn(
                  "text-[48px] font-bold transition-colors duration-300",
                  isSelected ? "text-white" : "text-[#2C3E50]"
                )}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {count}
              </span>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isSelected ? "text-white/90" : "text-[#2C3E50]"
                )}
              >
                Cycles
              </span>
              <span
                className={cn(
                  "text-xs transition-colors duration-300",
                  isSelected ? "text-white/70" : "text-[#6B7280]"
                )}
              >
                {duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="mt-16 w-full max-w-[400px] h-14 rounded-[28px] text-base font-semibold transition-all duration-200 hover:scale-[1.02] opacity-0"
        style={{
          backgroundColor: "#2C3E50",
          color: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          animation: "slide-up-fade 400ms ease-out forwards",
          animationDelay: "500ms",
        }}
      >
        Let's Breathe
      </button>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

export default CycleSelection;
