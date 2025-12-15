import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BreathingTechnique, breathingTechniques } from "./BreathingSelection";
import { NoseInhaleIcon, MouthExhaleIcon, HoldIcon } from "@/components/breathing/BreathingIcons";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

// Define extended phases for specific techniques
interface ExtendedPhase {
  name: "inhale" | "hold" | "exhale" | "rapid-inhale" | "rapid-exhale" | "retention" | "recovery" | "double-inhale" | "hold2";
  duration: number;
  label: string;
  isPursed?: boolean;
  repeatCount?: number;
}

// Technique-specific phase definitions (for 1 cycle)
const getTechniquePhases = (techniqueId: string): ExtendedPhase[] => {
  switch (techniqueId) {
    case "car-rage":
      // Pursed-Lip: Inhale 4s → Hold 4s → Exhale 8s (pursed)
      return [
        { name: "inhale", duration: 4, label: "Inhale" },
        { name: "hold", duration: 4, label: "Hold" },
        { name: "exhale", duration: 8, label: "Pursed Exhale", isPursed: true },
      ];
    case "reduce-brainfog":
      // Wim-Hof: 10x rapid breaths (1s in, 1s out) → 10s retention → recovery inhale
      return [
        // Rapid breathing phase (represented as alternating)
        { name: "rapid-inhale", duration: 1, label: "Rapid In", repeatCount: 10 },
        { name: "rapid-exhale", duration: 1, label: "Rapid Out", repeatCount: 10 },
        { name: "retention", duration: 10, label: "Hold" },
        { name: "recovery", duration: 3, label: "Recover" },
      ];
    case "overthinking-healer":
      // Resonance: Inhale 6s → Exhale 6s (no holds)
      return [
        { name: "inhale", duration: 6, label: "Inhale" },
        { name: "exhale", duration: 6, label: "Exhale" },
      ];
    default:
      return [];
  }
};

// Get flattened phases for techniques with rapid breathing
const getFlattenedPhases = (techniqueId: string): ExtendedPhase[] => {
  if (techniqueId === "reduce-brainfog") {
    const phases: ExtendedPhase[] = [];
    // 10 rapid breath cycles
    for (let i = 0; i < 10; i++) {
      phases.push({ name: "rapid-inhale", duration: 1, label: `Breath ${i + 1}` });
      phases.push({ name: "rapid-exhale", duration: 1, label: `Breath ${i + 1}` });
    }
    // Retention and recovery
    phases.push({ name: "retention", duration: 10, label: "Hold" });
    phases.push({ name: "recovery", duration: 3, label: "Recover" });
    return phases;
  }
  
  const customPhases = getTechniquePhases(techniqueId);
  if (customPhases.length > 0) {
    return customPhases;
  }
  
  return [];
};

const TOTAL_CYCLES = 3;

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

  // Check if this technique has custom phases
  const hasCustomPhases = ["car-rage", "reduce-brainfog", "overthinking-healer"].includes(technique.id);
  
  // Get phases for one cycle
  const cyclePhases: ExtendedPhase[] = useMemo(() => {
    if (hasCustomPhases) {
      return getFlattenedPhases(technique.id);
    }
    return technique.phases.map(p => ({
      name: p.name as ExtendedPhase["name"],
      duration: p.duration,
      label: p.label,
    }));
  }, [technique, hasCustomPhases]);

  const cycleDuration = useMemo(() => {
    return cyclePhases.reduce((acc, p) => acc + p.duration, 0);
  }, [cyclePhases]);

  const [showIntro, setShowIntro] = useState(true);
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(cyclePhases[0]?.duration || 4);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWellDone, setShowWellDone] = useState(false);
  const [textPulse, setTextPulse] = useState(false);

  const currentPhase = cyclePhases[phaseIndex];

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/quotes", { state: { mood } });
    }, 600);
  }, [navigate, mood]);

  // Breathing cycle logic
  useEffect(() => {
    if (showIntro || showWellDone) return;

    let currentCycleNum = 1;
    let currentPhaseIdx = 0;
    let secondsInPhase = 0;
    let totalSecondsInCycle = 0;

    const interval = setInterval(() => {
      secondsInPhase++;
      totalSecondsInCycle++;
      
      const phase = cyclePhases[currentPhaseIdx];
      const phaseDuration = phase.duration;

      // Update phase progress (0-100)
      setPhaseProgress((secondsInPhase / phaseDuration) * 100);
      
      // Update cycle progress
      setCycleProgress((totalSecondsInCycle / cycleDuration) * 100);

      // Update countdown
      setPhaseTimeLeft(phaseDuration - secondsInPhase);

      // Check if phase is complete
      if (secondsInPhase >= phaseDuration) {
        currentPhaseIdx++;
        secondsInPhase = 0;

        if (currentPhaseIdx >= cyclePhases.length) {
          // Cycle complete
          if (currentCycleNum >= TOTAL_CYCLES) {
            // All cycles complete
            clearInterval(interval);
            setShowWellDone(true);
            setTimeout(() => {
              setIsExiting(true);
              setTimeout(() => {
                navigate("/quotes", { state: { mood } });
              }, 600);
            }, 2000);
            return;
          }
          
          // Start next cycle
          currentCycleNum++;
          setCurrentCycle(currentCycleNum);
          currentPhaseIdx = 0;
          totalSecondsInCycle = 0;
          setCycleProgress(0);
        }

        setPhaseIndex(currentPhaseIdx);
        setPhaseTimeLeft(cyclePhases[currentPhaseIdx]?.duration || 0);
        setPhaseProgress(0);
        setTextPulse(true);
        setTimeout(() => setTextPulse(false), 300);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro, showWellDone, navigate, mood, cyclePhases, cycleDuration]);

  // Handle manual start
  const handleStartBreathing = useCallback(() => {
    setIsIntroExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsLoaded(true);
    }, 400);
  }, []);

  // Get phase display icon
  const renderPhaseIcon = () => {
    if (!currentPhase) return null;
    
    const phaseName = currentPhase.name;
    
    if (phaseName === "inhale" || phaseName === "rapid-inhale" || phaseName === "double-inhale" || phaseName === "recovery") {
      return <NoseInhaleIcon seconds={phaseTimeLeft} />;
    }
    
    if (phaseName === "exhale" || phaseName === "rapid-exhale") {
      const isPursed = currentPhase.isPursed || technique.id === "car-rage";
      return <MouthExhaleIcon seconds={phaseTimeLeft} pursed={isPursed} />;
    }
    
    if (phaseName === "hold" || phaseName === "hold2" || phaseName === "retention") {
      return <HoldIcon seconds={phaseTimeLeft} />;
    }
    
    return null;
  };

  // Render sine wave SVG
  const renderSineWave = () => {
    const width = 320;
    const height = 160;
    const centerY = height / 2;
    const amplitude = 50;
    
    // Calculate dot position based on cycle progress
    const dotX = (cycleProgress / 100) * width;
    
    // Calculate Y based on current phase
    let dotY = centerY;
    const phaseName = currentPhase?.name;
    
    if (phaseName === "inhale" || phaseName === "rapid-inhale" || phaseName === "recovery" || phaseName === "double-inhale") {
      // Going up
      dotY = centerY - amplitude * Math.sin((phaseProgress / 100) * (Math.PI / 2));
    } else if (phaseName === "exhale" || phaseName === "rapid-exhale") {
      // Going down from top
      dotY = centerY - amplitude + (amplitude * 2) * Math.sin((phaseProgress / 100) * (Math.PI / 2));
    } else if (phaseName === "hold") {
      // At top
      dotY = centerY - amplitude;
    } else if (phaseName === "retention" || phaseName === "hold2") {
      // At bottom or center
      dotY = centerY + amplitude * 0.5;
    }

    // Generate wave path
    let pathD = `M 0 ${centerY}`;
    for (let x = 0; x <= width; x += 4) {
      const progress = x / width;
      const y = centerY - amplitude * Math.sin(progress * Math.PI * 2);
      pathD += ` L ${x} ${y}`;
    }

    return (
      <div className="relative w-full max-w-[340px] mx-auto mb-8">
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Guide lines */}
          <line
            x1="0" y1={centerY - amplitude}
            x2={width} y2={centerY - amplitude}
            stroke="rgba(44, 62, 80, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="0" y1={centerY + amplitude}
            x2={width} y2={centerY + amplitude}
            stroke="rgba(44, 62, 80, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          
          {/* Background wave path */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(44, 62, 80, 0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Active wave path (up to current position) */}
          <path
            d={pathD}
            fill="none"
            stroke="#2C3E50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={width}
            strokeDashoffset={width - (cycleProgress / 100) * width}
            style={{ transition: "stroke-dashoffset 100ms linear" }}
          />
          
          {/* Moving dot */}
          <circle
            cx={Math.max(10, Math.min(dotX, width - 10))}
            cy={dotY}
            r="10"
            fill="#2C3E50"
            stroke="white"
            strokeWidth="3"
            style={{
              filter: "drop-shadow(0 2px 6px rgba(44, 62, 80, 0.3))",
              transition: "cx 100ms linear, cy 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
      </div>
    );
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
            {technique.headline || technique.name}
          </h1>

          <p
            className="mt-6 text-base font-normal opacity-0"
            style={{
              color: "#6B6B6B",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "200ms",
            }}
          >
            {technique.bulletPoints[0]}
          </p>

          <p
            className="mt-8 text-lg font-medium opacity-0"
            style={{
              color: "#2C3E50",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "300ms",
            }}
          >
            3 cycles · {Math.round(cycleDuration * TOTAL_CYCLES / 60)} min
          </p>

          <button
            onClick={handleStartBreathing}
            className="mt-12 w-full max-w-[300px] h-14 rounded-[28px] text-base font-medium transition-all duration-200 hover:scale-[1.02] opacity-0"
            style={{
              backgroundColor: "#2C3E50",
              color: "white",
              boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "500ms",
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
          "min-h-screen w-full flex flex-col items-center justify-center transition-opacity duration-600",
          isExiting ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <h1
          className="text-[32px] font-medium animate-fade-in"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          Well done
        </h1>
        <p
          className="mt-4 text-lg animate-fade-in"
          style={{
            color: "#6B6B6B",
            animationDelay: "200ms",
          }}
        >
          {TOTAL_CYCLES} cycles completed
        </p>
      </main>
    );
  }

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center relative transition-all duration-500 px-6",
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
        aria-label="Skip breathing exercise"
      >
        Skip
      </button>

      {/* Cycle indicator */}
      <div className="absolute top-7 left-5 flex gap-2">
        {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < currentCycle ? "#2C3E50" : "rgba(44, 62, 80, 0.2)",
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center w-full max-w-[400px]">
        {/* Technique info (stacked) */}
        <div
          className="text-center mb-8 transition-all duration-300"
          style={{ transform: textPulse ? "scale(1.02)" : "scale(1)" }}
        >
          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
            }}
          >
            {technique.headline || technique.name}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6B6B6B" }}>
            {technique.bulletPoints[0]}
          </p>
        </div>

        {/* Sine wave animation */}
        {renderSineWave()}

        {/* Phase icon with countdown */}
        <div className="flex flex-col items-center animate-fade-in">
          {renderPhaseIcon()}
          
          {/* Phase label */}
          <p
            className="mt-4 text-base font-medium"
            style={{ color: "rgba(44, 62, 80, 0.7)" }}
          >
            {currentPhase?.label}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-full">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(44, 62, 80, 0.15)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${cycleProgress}%`,
                backgroundColor: "#2C3E50",
                transition: "width 100ms linear",
              }}
            />
          </div>
          <p
            className="text-center text-xs mt-3"
            style={{ color: "rgba(44, 62, 80, 0.5)" }}
          >
            Cycle {currentCycle} of {TOTAL_CYCLES}
          </p>
        </div>
      </div>

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
      `}</style>
    </main>
  );
};

export default Breathing;
