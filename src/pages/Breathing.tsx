import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BreathingTechnique, breathingTechniques } from "./BreathingSelection";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

// Segment colors
const SEGMENT_COLORS: Record<string, string> = {
  inhale: "#4A90E2",   // calm blue
  "double-inhale": "#5BA3E8", // lighter blue
  hold: "#A8C5B5",     // soft teal/green
  hold2: "#95B8A6",    // slightly darker teal
  exhale: "#8B7EC8",   // soft purple
};

const Breathing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood as MoodType || "calm";
  
  // Get technique from navigation state or localStorage fallback
  const technique: BreathingTechnique = useMemo(() => {
    if (location.state?.technique) {
      return location.state.technique;
    }
    const savedId = localStorage.getItem("nudgeme_breathing_technique");
    return breathingTechniques.find(t => t.id === savedId) || breathingTechniques[0];
  }, [location.state?.technique]);

  const phases = technique.phases;
  const TOTAL_DURATION = technique.durationSeconds;

  const [showIntro, setShowIntro] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(phases[0].duration);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWellDone, setShowWellDone] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [dotProgress, setDotProgress] = useState(0);
  const [textPulse, setTextPulse] = useState(false);
  const [timerPulse, setTimerPulse] = useState(false);

  const currentPhase = phases[phaseIndex];

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/quotes", { state: { mood } });
    }, 600);
  }, [navigate, mood]);

  // Breathing cycle logic
  useEffect(() => {
    if (showIntro) return;

    let currentPhaseIdx = 0;
    let secondsInPhase = 0;
    let totalSeconds = 0;

    const interval = setInterval(() => {
      totalSeconds++;
      secondsInPhase++;

      const phase = phases[currentPhaseIdx];
      const phaseDuration = phase.duration;

      // Update dot progress (0-100 within current phase)
      setDotProgress((secondsInPhase / phaseDuration) * 100);

      // Update countdown with pulse
      setPhaseTimeLeft(phaseDuration - secondsInPhase);
      setTimerPulse(true);
      setTimeout(() => setTimerPulse(false), 250);

      // Update total progress
      setTotalProgress((totalSeconds / TOTAL_DURATION) * 100);

      // Check if phase is complete
      if (secondsInPhase >= phaseDuration) {
        setCompletedPhases((prev) => [...prev, currentPhaseIdx]);
        currentPhaseIdx++;
        secondsInPhase = 0;

        if (currentPhaseIdx >= phases.length) {
          // Breathing complete
          clearInterval(interval);
          setShowWellDone(true);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              navigate("/quotes", { state: { mood } });
            }, 600);
          }, 1500);
          return;
        }

        setPhaseIndex(currentPhaseIdx);
        setPhaseTimeLeft(phases[currentPhaseIdx].duration);
        setDotProgress(0);
        setTextPulse(true);
        setTimeout(() => setTextPulse(false), 300);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro, navigate, mood, phases, TOTAL_DURATION]);

  // Calculate dot position based on technique phases
  const getDotPosition = () => {
    // For techniques with 3 phases (478, sigh): use 3-segment path
    // For techniques with 4 phases (box): use 4-segment path (full box)
    const numPhases = phases.length;
    const progress = dotProgress / 100;
    
    if (numPhases === 4) {
      // Box breathing: full square A→B→C→D→A
      const points = [
        { x: 40, y: 260 },  // A - bottom left
        { x: 40, y: 40 },   // B - top left
        { x: 260, y: 40 },  // C - top right
        { x: 260, y: 260 }, // D - bottom right
      ];
      const start = points[phaseIndex];
      const end = points[(phaseIndex + 1) % 4];
      return {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
      };
    } else {
      // 3-phase techniques: A→B→C→D path
      const points = [
        { x: 40, y: 260 },  // A
        { x: 40, y: 40 },   // B
        { x: 260, y: 40 },  // C
        { x: 260, y: 260 }, // D
      ];
      const start = points[phaseIndex];
      const end = points[phaseIndex + 1];
      return {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
      };
    }
  };

  const dotPos = getDotPosition();

  // Get phase display name
  const getPhaseDisplayName = (phaseName: string) => {
    switch (phaseName) {
      case "inhale": return "Inhale";
      case "double-inhale": return "Quick Inhale";
      case "hold": return "Hold";
      case "hold2": return "Hold";
      case "exhale": return "Exhale";
      default: return phaseName;
    }
  };

  // Handle manual start
  const handleStartBreathing = useCallback(() => {
    setIsIntroExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsLoaded(true);
    }, 400);
  }, []);

  // Get segment opacity based on state
  const getSegmentStyle = (segmentIndex: number) => {
    const isCompleted = completedPhases.includes(segmentIndex);
    const isActive = phaseIndex === segmentIndex && !completedPhases.includes(segmentIndex);
    const phaseName = phases[segmentIndex]?.name || "inhale";

    if (isCompleted) {
      return {
        stroke: SEGMENT_COLORS[phaseName] || "#4A90E2",
        strokeOpacity: 0.5,
        strokeDasharray: "none",
      };
    }
    if (isActive) {
      return {
        stroke: SEGMENT_COLORS[phaseName] || "#4A90E2",
        strokeOpacity: 1,
        strokeDasharray: "none",
      };
    }
    // Future
    return {
      stroke: "#2C3E50",
      strokeOpacity: 0.25,
      strokeDasharray: "8 6",
    };
  };

  // Generate path segments based on technique
  const renderPathSegments = () => {
    const numPhases = phases.length;
    
    if (numPhases === 4) {
      // Box breathing: 4 equal sides
      return (
        <>
          <path d="M 40 260 L 40 40" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(0), transition: "all 300ms ease" }} />
          <path d="M 40 40 L 260 40" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(1), transition: "all 300ms ease" }} />
          <path d="M 260 40 L 260 260" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(2), transition: "all 300ms ease" }} />
          <path d="M 260 260 L 40 260" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(3), transition: "all 300ms ease" }} />
        </>
      );
    } else {
      // 3-phase techniques: A→B→C→D
      return (
        <>
          <path d="M 40 260 L 40 40" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(0), transition: "all 300ms ease" }} />
          <path d="M 40 40 L 260 40" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(1), transition: "all 300ms ease" }} />
          <path d="M 260 40 L 260 260" strokeWidth="5" fill="none" strokeLinecap="round" style={{ ...getSegmentStyle(2), transition: "all 300ms ease" }} />
        </>
      );
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <main
        className={cn(
          "min-h-screen w-full flex flex-col items-center justify-center px-8 transition-opacity duration-400",
          isIntroExiting ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <div className="text-center max-w-[380px]">
          <h1
            className="text-[28px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.4px] opacity-0"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
              animation: "fade-in-up 600ms ease-out forwards",
              animationDelay: "0ms",
            }}
          >
            {technique.name}
          </h1>

          <p
            className="mt-8 text-lg font-normal opacity-0"
            style={{
              color: "#6B6B6B",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "200ms",
            }}
          >
            Take {technique.duration} for yourself
          </p>

          <p
            className="mt-3 text-sm font-normal opacity-0"
            style={{
              color: "rgba(107, 107, 107, 0.8)",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "300ms",
            }}
          >
            {technique.bulletPoints.join(" • ")}
          </p>

          <div
            className="mt-10 py-4 px-5 rounded-xl opacity-0"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              border: "1px solid rgba(44, 62, 80, 0.1)",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "400ms",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.5px]"
              style={{ color: "#2C3E50" }}
            >
              Scientific Evidence
            </p>
            <p className="mt-2 text-[13px] font-normal" style={{ color: "#6B6B6B" }}>
              {technique.badge || technique.attribution}
            </p>
          </div>

          <button
            onClick={handleStartBreathing}
            className="mt-14 w-full max-w-[300px] h-14 rounded-[28px] text-base font-medium transition-all duration-200 hover:scale-[1.02] opacity-0"
            style={{
              backgroundColor: "#2C3E50",
              color: "white",
              boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "600ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1A2634";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(44, 62, 80, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2C3E50";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(44, 62, 80, 0.2)";
            }}
          >
            Let's Breathe
          </button>
        </div>
      </main>
    );
  }

  // Well done screen
  if (showWellDone) {
    return (
      <main
        className={cn(
          "min-h-screen w-full flex items-center justify-center transition-opacity duration-600",
          isExiting ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <h1
          className="text-[28px] font-medium animate-fade-in"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          Well done
        </h1>
      </main>
    );
  }

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center relative transition-all duration-500",
        isExiting ? "opacity-0" : "opacity-100",
        isLoaded ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-7 right-5 text-[15px] font-normal z-10 transition-all duration-200 hover:underline"
        style={{ color: "rgba(44, 62, 80, 0.6)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#2C3E50")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(44, 62, 80, 0.6)")}
        aria-label="Skip breathing exercise"
      >
        Skip
      </button>

      {/* Center content */}
      <div className="flex flex-col items-center">
        {/* Phase text above square */}
        <div
          className="mb-8 text-center transition-all duration-300"
          style={{
            transform: textPulse ? "scale(1.05)" : "scale(1)",
          }}
        >
          <p
            className="text-2xl font-semibold tracking-[-0.5px] animate-fade-in"
            style={{ color: "#2C3E50" }}
          >
            {getPhaseDisplayName(currentPhase.name)}
          </p>
        </div>

        {/* Square path container with centered countdown */}
        <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px]">
          {/* SVG path */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            className="animate-scale-in"
          >
            {/* Dynamic path segments based on technique */}
            {renderPathSegments()}

            {/* Corner labels */}
            {[
              { x: 20, y: 268, label: "A" },
              { x: 20, y: 40, label: "B" },
              { x: 280, y: 40, label: "C" },
              { x: 280, y: 268, label: "D" },
            ].map(({ x, y, label }) => (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="600"
                fill="#2C3E50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {label}
              </text>
            ))}

            {/* Moving dot indicator */}
            <circle
              cx={dotPos.x}
              cy={dotPos.y}
              r="10"
              fill="#2C3E50"
              stroke="white"
              strokeWidth="3"
              style={{
                filter: "drop-shadow(0 3px 8px rgba(44, 62, 80, 0.3))",
                transition: "cx 100ms linear, cy 100ms linear",
              }}
            />
          </svg>

          {/* Centered countdown inside square */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="text-7xl font-bold transition-transform"
              style={{
                color: "#2C3E50",
                transform: timerPulse ? "scale(1.1)" : "scale(1)",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-out",
              }}
            >
              {phaseTimeLeft}
            </span>
          </div>
        </div>

        {/* Progress bar - closer to square */}
        <div className="mt-10 w-[280px] sm:w-[300px] flex flex-col items-center">
          {/* Progress bar track */}
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(44, 62, 80, 0.2)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${totalProgress}%`,
                backgroundColor: "#2C3E50",
                transition: "width 1000ms linear",
              }}
            />
          </div>

          {/* Phase labels below progress bar - dynamically rendered */}
          <div className="w-full flex justify-between mt-2 text-xs">
            {phases.map((p, idx) => (
              <span
                key={p.name + idx}
                className="transition-all duration-200"
                style={{
                  color: phaseIndex === idx ? "#2C3E50" : "#6B6B6B",
                  fontWeight: phaseIndex === idx ? 600 : 400,
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Breathing;