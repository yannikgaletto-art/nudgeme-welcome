import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";
type BreathPhase = "inhale" | "hold-top" | "exhale" | "hold-bottom";
const phaseConfig: Record<BreathPhase, {
  text: string;
  duration: number;
  icon?: string;
}> = {
  inhale: {
    text: "Inhale",
    duration: 3,
    icon: "↑"
  },
  "hold-top": {
    text: "Hold",
    duration: 5
  },
  exhale: {
    text: "Exhale",
    duration: 7,
    icon: "↓"
  },
  "hold-bottom": {
    text: "Hold",
    duration: 5
  }
};
const PHASES: BreathPhase[] = ["inhale", "hold-top", "exhale", "hold-bottom"];
const TOTAL_DURATION = 20; // 3 + 5 + 7 + 5 = 20 seconds

// Trapezoid path points
const PATH = {
  A: {
    x: 40,
    y: 160
  },
  // Bottom left (start)
  B: {
    x: 60,
    y: 40
  },
  // Top left
  C: {
    x: 220,
    y: 40
  },
  // Top right
  D: {
    x: 240,
    y: 160
  } // Bottom right
};
const Breathing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood as MoodType || "calm";
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(phaseConfig.inhale.duration);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWellDone, setShowWellDone] = useState(false);
  const [completedSegments, setCompletedSegments] = useState<BreathPhase[]>([]);
  const [dotProgress, setDotProgress] = useState(0); // 0-100 within current phase

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/quotes", {
        state: {
          mood
        }
      });
    }, 600);
  }, [navigate, mood]);

  // No auto-transition - user clicks button to start

  // Breathing cycle logic
  useEffect(() => {
    if (showIntro) return;
    let phaseIndex = 0;
    let secondsInPhase = 0;
    let totalSeconds = 0;
    const interval = setInterval(() => {
      totalSeconds++;
      secondsInPhase++;
      const currentPhase = PHASES[phaseIndex];
      const phaseDuration = phaseConfig[currentPhase].duration;

      // Update dot progress (0-100 within current phase)
      setDotProgress(secondsInPhase / phaseDuration * 100);

      // Update countdown
      setPhaseTimeLeft(phaseDuration - secondsInPhase);

      // Update total progress
      setTotalProgress(totalSeconds / TOTAL_DURATION * 100);

      // Check if phase is complete
      if (secondsInPhase >= phaseDuration) {
        setCompletedSegments(prev => [...prev, currentPhase]);
        phaseIndex++;
        secondsInPhase = 0;
        if (phaseIndex >= PHASES.length) {
          // Breathing complete
          clearInterval(interval);
          setShowWellDone(true);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              navigate("/quotes", {
                state: {
                  mood
                }
              });
            }, 600);
          }, 1000);
          return;
        }
        setPhase(PHASES[phaseIndex]);
        setPhaseTimeLeft(phaseConfig[PHASES[phaseIndex]].duration);
        setDotProgress(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showIntro, navigate, mood]);

  // Calculate dot position on the trapezoid path
  const getDotPosition = () => {
    const phaseIndex = PHASES.indexOf(phase);
    const points = [PATH.A, PATH.B, PATH.C, PATH.D, PATH.A];
    const start = points[phaseIndex];
    const end = points[phaseIndex + 1];
    const progress = dotProgress / 100;
    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress
    };
  };
  const dotPos = getDotPosition();

  // Handle manual start
  const handleStartBreathing = useCallback(() => {
    setIsIntroExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsLoaded(true);
    }, 400);
  }, []);

  // Intro screen
  if (showIntro) {
    return <main className={cn("min-h-screen w-full flex flex-col items-center justify-center px-8 transition-opacity duration-400", isIntroExiting ? "opacity-0" : "opacity-100")} style={{
      backgroundColor: "#F5E6D3"
    }}>
        <div className="text-center max-w-[380px]">
          {/* Main headline */}
          <h1 className="text-[28px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.4px] opacity-0" style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2C3E50",
          animation: "fade-in-up 600ms ease-out forwards",
          animationDelay: "0ms"
        }}>Before we motivate you,       we balance you</h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg font-normal opacity-0" style={{
          color: "#6B6B6B",
          animation: "fade-in-up 500ms ease-out forwards",
          animationDelay: "200ms"
        }}>
            Take 19 seconds for yourself
          </p>

          {/* Scientific reference box */}
          <div className="mt-12 py-4 px-5 rounded-xl opacity-0" style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(44, 62, 80, 0.1)",
          animation: "fade-in-up 500ms ease-out forwards",
          animationDelay: "400ms"
        }}>
            <p className="text-xs font-semibold uppercase tracking-[0.5px]" style={{
            color: "#2C3E50"
          }}>Scientific Evidence-based Breathwork </p>
            <p className="mt-2 text-[13px] font-normal" style={{
            color: "#6B6B6B"
          }}>
              Spiegel & Huberman - Stanford Study | 2023
            </p>
          </div>

          {/* CTA Button */}
          <button onClick={handleStartBreathing} className="mt-14 w-full max-w-[300px] h-14 rounded-[28px] text-base font-medium transition-all duration-200 hover:scale-[1.02] opacity-0" style={{
          backgroundColor: "#2C3E50",
          color: "white",
          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          animation: "fade-in-up 500ms ease-out forwards",
          animationDelay: "600ms"
        }} onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = "#1A2634";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(44, 62, 80, 0.25)";
        }} onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = "#2C3E50";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(44, 62, 80, 0.2)";
        }}>
            Let's Breathe
          </button>
        </div>
      </main>;
  }

  // Well done screen
  if (showWellDone) {
    return <main className={cn("min-h-screen w-full flex items-center justify-center transition-opacity duration-500", isExiting ? "opacity-0" : "opacity-100")} style={{
      backgroundColor: "#F5E6D3"
    }}>
        <h1 className="text-[32px] font-medium animate-fade-in" style={{
        fontFamily: "'Playfair Display', serif",
        color: "#2C3E50"
      }}>
          Well done
        </h1>
      </main>;
  }
  return <main className={cn("min-h-screen w-full flex flex-col items-center justify-center relative transition-all duration-500", isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100", isLoaded ? "opacity-100" : "opacity-0")} style={{
    backgroundColor: "#F5E6D3"
  }}>
      {/* Skip button */}
      <button onClick={handleSkip} className="absolute top-6 right-5 text-sm font-normal z-10 transition-all duration-200 hover:underline" style={{
      color: "rgba(44, 62, 80, 0.6)"
    }} onMouseEnter={e => e.currentTarget.style.color = "#2C3E50"} onMouseLeave={e => e.currentTarget.style.color = "rgba(44, 62, 80, 0.6)"} aria-label="Skip breathing exercise">
        Skip
      </button>

      {/* Center content */}
      <div className="flex flex-col items-center">
        {/* Instruction text above path */}
        <div key={phase} className="mb-10 text-center animate-fade-in">
          <p className="text-xl font-medium" style={{
          color: "#2C3E50"
        }}>
            {phaseConfig[phase].icon && <span className="mr-2">{phaseConfig[phase].icon}</span>}
            {phaseConfig[phase].text}
          </p>
        </div>

        {/* Trapezoid path visualization */}
        <svg width="280" height="200" viewBox="0 0 280 200" className="animate-scale-in">
          {/* Segment 1: A→B (Inhale) - soft blue */}
          <path d={`M ${PATH.A.x} ${PATH.A.y} L ${PATH.B.x} ${PATH.B.y}`} stroke="#B4D7E8" strokeWidth="3" fill="none" strokeLinecap="round" style={{
          opacity: completedSegments.includes("inhale") ? 0.5 : 1,
          transition: "opacity 300ms ease"
        }} />
          
          {/* Segment 2: B→C (Hold top) - soft green */}
          <path d={`M ${PATH.B.x} ${PATH.B.y} L ${PATH.C.x} ${PATH.C.y}`} stroke="#A8C5B5" strokeWidth="3" fill="none" strokeLinecap="round" style={{
          opacity: completedSegments.includes("hold-top") ? 0.5 : 1,
          transition: "opacity 300ms ease"
        }} />
          
          {/* Segment 3: C→D (Exhale) - soft purple */}
          <path d={`M ${PATH.C.x} ${PATH.C.y} L ${PATH.D.x} ${PATH.D.y}`} stroke="#D4C5E8" strokeWidth="3" fill="none" strokeLinecap="round" style={{
          opacity: completedSegments.includes("exhale") ? 0.5 : 1,
          transition: "opacity 300ms ease"
        }} />
          
          {/* Segment 4: D→A (Hold bottom) - soft peach */}
          <path d={`M ${PATH.D.x} ${PATH.D.y} L ${PATH.A.x} ${PATH.A.y}`} stroke="#FFD4A3" strokeWidth="3" fill="none" strokeLinecap="round" style={{
          opacity: completedSegments.includes("hold-bottom") ? 0.5 : 1,
          transition: "opacity 300ms ease"
        }} />

          {/* Moving dot indicator */}
          <circle cx={dotPos.x} cy={dotPos.y} r="8" fill="#2C3E50" style={{
          filter: "drop-shadow(0 2px 8px rgba(44, 62, 80, 0.2))",
          transition: "cx 100ms linear, cy 100ms linear"
        }} />
        </svg>

        {/* Countdown timer below path */}
        <div className="mt-16">
          <span key={phaseTimeLeft} className="text-5xl font-semibold animate-timer-pulse" style={{
          color: "#2C3E50"
        }}>
            {phaseTimeLeft}
          </span>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-8 left-8 right-8 flex flex-col items-center">
        <div className="w-full max-w-[400px] h-1.5 rounded-full overflow-hidden" style={{
        backgroundColor: "rgba(44, 62, 80, 0.2)"
      }}>
          <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{
          width: `${totalProgress}%`,
          backgroundColor: "#2C3E50"
        }} />
        </div>
        
        {/* Phase label below progress bar */}
        <p className="mt-2 text-xs" style={{
        color: "#6B6B6B"
      }}>
          {phaseConfig[phase].text}
        </p>
      </div>
    </main>;
};
export default Breathing;