import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

const moodGradients: Record<MoodType, string> = {
  overwhelmed: "linear-gradient(180deg, #FFD4A3 0%, #FFF0E0 100%)",
  anxious: "linear-gradient(180deg, #FFE0E0 0%, #FFF5F5 100%)",
  sad: "linear-gradient(180deg, #E8DFF5 0%, #F5F0FA 100%)",
  nervous: "linear-gradient(180deg, #FFFADB 0%, #FFFEF0 100%)",
  neutral: "linear-gradient(180deg, #EBEBEB 0%, #F8F8F8 100%)",
  calm: "linear-gradient(180deg, #D0E8F2 0%, #EBF5F9 100%)",
  energized: "linear-gradient(180deg, #C5DFD1 0%, #E5F2EB 100%)",
};

type BreathPhase = "inhale" | "hold-in" | "exhale" | "hold-out";

const phaseTexts: Record<BreathPhase, string> = {
  inhale: "Breathe in",
  "hold-in": "Hold",
  exhale: "Breathe out",
  "hold-out": "Hold",
};

const PHASE_DURATION = 4000; // 4 seconds per phase
const TOTAL_CYCLES = 2;

const Breathing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as MoodType) || "calm";

  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [cycle, setCycle] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/quotes", { state: { mood } });
    }, 600);
  }, [navigate, mood]);

  const handleScreenTap = useCallback(() => {
    if (showSkipHint) {
      handleSkip();
    } else {
      setShowSkipHint(true);
      setTimeout(() => setShowSkipHint(false), 2000);
    }
  }, [showSkipHint, handleSkip]);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Breathing cycle logic
  useEffect(() => {
    const phases: BreathPhase[] = ["inhale", "hold-in", "exhale", "hold-out"];
    let currentPhaseIndex = 0;
    let currentCycle = 0;

    const interval = setInterval(() => {
      currentPhaseIndex++;
      
      if (currentPhaseIndex >= phases.length) {
        currentPhaseIndex = 0;
        currentCycle++;
        setCycle(currentCycle);
        
        if (currentCycle >= TOTAL_CYCLES) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(() => {
            navigate("/quotes", { state: { mood } });
          }, 600);
          return;
        }
      }
      
      setPhase(phases[currentPhaseIndex]);
    }, PHASE_DURATION);

    return () => clearInterval(interval);
  }, [navigate, mood]);

  const gradient = moodGradients[mood];

  // Determine animation class based on phase
  const getBreathingClass = () => {
    switch (phase) {
      case "inhale":
        return "animate-breath-in";
      case "hold-in":
        return "animate-breath-hold-in";
      case "exhale":
        return "animate-breath-out";
      case "hold-out":
        return "animate-breath-hold-out";
      default:
        return "";
    }
  };

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500",
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}
      style={{ background: gradient }}
      onClick={handleScreenTap}
    >
      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/10 animate-float-particle"
            style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              left: `${10 + i * 20}%`,
              top: `${60 + Math.random() * 30}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-6 right-5 text-foreground/60 hover:text-foreground hover:underline transition-all duration-200 text-sm font-normal z-10"
        aria-label="Skip breathing exercise"
      >
        Skip
      </button>

      {/* Skip hint */}
      {showSkipHint && (
        <div className="absolute top-20 right-5 text-foreground/60 text-xs animate-fade-in">
          Tap again to skip
        </div>
      )}

      {/* Center content */}
      <div
        className={cn(
          "flex flex-col items-center justify-center transition-all duration-600",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {/* Character and breathing circle container */}
        <div className="relative flex items-center justify-center">
          {/* Breathing circle */}
          <div
            className={cn(
              "absolute rounded-full border-[3px] border-foreground/40 transition-all ease-in-out",
              getBreathingClass()
            )}
            style={{
              width: phase === "inhale" || phase === "hold-in" ? "280px" : "180px",
              height: phase === "inhale" || phase === "hold-in" ? "280px" : "180px",
              transitionDuration: phase === "hold-in" || phase === "hold-out" ? "0ms" : "4000ms",
            }}
          />

          {/* Meditation character SVG */}
          <svg
            width="200"
            height="220"
            viewBox="0 0 200 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "relative z-10 transition-transform ease-in-out",
              getBreathingClass()
            )}
            style={{
              transform: phase === "inhale" || phase === "hold-in" ? "scale(1.05)" : "scale(1)",
              transitionDuration: phase === "hold-in" || phase === "hold-out" ? "0ms" : "4000ms",
            }}
          >
            {/* Head */}
            <circle cx="100" cy="50" r="35" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            
            {/* Closed eyes - peaceful expression */}
            <path d="M82 48 Q88 52 94 48" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M106 48 Q112 52 118 48" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Gentle smile */}
            <path d="M88 62 Q100 72 112 62" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Neck */}
            <line x1="100" y1="85" x2="100" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
            
            {/* Body - torso */}
            <ellipse cx="100" cy="130" rx="40" ry="35" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            
            {/* Arms - meditation pose on knees */}
            <path d="M60 120 Q40 140 55 165" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M140 120 Q160 140 145 165" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Hands on knees */}
            <circle cx="55" cy="168" r="8" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            <circle cx="145" cy="168" r="8" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            
            {/* Crossed legs */}
            <path d="M60 160 Q80 180 100 175 Q120 180 140 160" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50 175 Q70 195 100 190 Q130 195 150 175" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Feet */}
            <ellipse cx="55" cy="188" rx="15" ry="8" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
            <ellipse cx="145" cy="188" rx="15" ry="8" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Instruction text */}
        <div className="mt-16 text-center">
          <p
            key={phase}
            className="text-foreground font-medium text-[22px] animate-text-pulse"
          >
            {phaseTexts[phase]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-10 flex gap-3">
          {[...Array(TOTAL_CYCLES)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i <= cycle ? "bg-foreground" : "bg-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Breathing;
