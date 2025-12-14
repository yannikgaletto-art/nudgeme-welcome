import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";
type BreathPhase = "inhale" | "hold" | "exhale";

const phaseConfig: Record<BreathPhase, { text: string; duration: number }> = {
  inhale: { text: "Inhale", duration: 4 },
  hold: { text: "Hold", duration: 7 },
  exhale: { text: "Exhale", duration: 8 },
};

const PHASES: BreathPhase[] = ["inhale", "hold", "exhale"];
const TOTAL_DURATION = 19; // 4 + 7 + 8 = 19 seconds

// Box path points (with more padding for labels)
const PATH = {
  A: { x: 50, y: 280 },   // Bottom left (start)
  B: { x: 50, y: 40 },    // Top left
  C: { x: 310, y: 40 },   // Top right
  D: { x: 310, y: 280 },  // Bottom right (end)
};

// Segment colors
const SEGMENT_COLORS = {
  inhale: "#4A90E2",   // calm blue
  hold: "#A8C5B5",     // soft teal/green
  exhale: "#8B7EC8",   // soft purple
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
  const [dotProgress, setDotProgress] = useState(0);
  const [textPulse, setTextPulse] = useState(false);
  const [timerPulse, setTimerPulse] = useState(false);

  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/quotes", { state: { mood } });
    }, 600);
  }, [navigate, mood]);

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
      setDotProgress((secondsInPhase / phaseDuration) * 100);

      // Update countdown with pulse
      setPhaseTimeLeft(phaseDuration - secondsInPhase);
      setTimerPulse(true);
      setTimeout(() => setTimerPulse(false), 250);

      // Update total progress
      setTotalProgress((totalSeconds / TOTAL_DURATION) * 100);

      // Check if phase is complete
      if (secondsInPhase >= phaseDuration) {
        setCompletedSegments((prev) => [...prev, currentPhase]);
        phaseIndex++;
        secondsInPhase = 0;

        if (phaseIndex >= PHASES.length) {
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

        setPhase(PHASES[phaseIndex]);
        setPhaseTimeLeft(phaseConfig[PHASES[phaseIndex]].duration);
        setDotProgress(0);
        setTextPulse(true);
        setTimeout(() => setTextPulse(false), 300);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro, navigate, mood]);

  // Calculate dot position on the box path
  const getDotPosition = () => {
    const phaseIndex = PHASES.indexOf(phase);
    const points = [PATH.A, PATH.B, PATH.C, PATH.D];
    const start = points[phaseIndex];
    const end = points[phaseIndex + 1];
    const progress = dotProgress / 100;

    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress,
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

  // Get segment opacity based on state
  const getSegmentStyle = (segmentPhase: BreathPhase) => {
    const isCompleted = completedSegments.includes(segmentPhase);
    const isActive = phase === segmentPhase && !completedSegments.includes(segmentPhase);
    const isFuture = !isCompleted && !isActive;

    if (isCompleted) {
      return {
        stroke: SEGMENT_COLORS[segmentPhase],
        strokeOpacity: 0.5,
        strokeDasharray: "none",
      };
    }
    if (isActive) {
      return {
        stroke: SEGMENT_COLORS[segmentPhase],
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
            Before we motivate you, we balance you
          </h1>

          <p
            className="mt-8 text-lg font-normal opacity-0"
            style={{
              color: "#6B6B6B",
              animation: "fade-in-up 500ms ease-out forwards",
              animationDelay: "200ms",
            }}
          >
            Take 19 seconds for yourself
          </p>

          <div
            className="mt-12 py-4 px-5 rounded-xl opacity-0"
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
              Spiegel & Huberman - Stanford Study | 2023
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
            {phaseConfig[phase].text}
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
            {/* Adjusted path for 300x300 viewBox */}
            {/* Segment 1: A→B (Inhale) - vertical up */}
            <path
              d="M 40 260 L 40 40"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{
                ...getSegmentStyle("inhale"),
                transition: "all 300ms ease",
              }}
            />

            {/* Segment 2: B→C (Hold) - horizontal right */}
            <path
              d="M 40 40 L 260 40"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{
                ...getSegmentStyle("hold"),
                transition: "all 300ms ease",
              }}
            />

            {/* Segment 3: C→D (Exhale) - vertical down */}
            <path
              d="M 260 40 L 260 260"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              style={{
                ...getSegmentStyle("exhale"),
                transition: "all 300ms ease",
              }}
            />

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
              cx={40 + (phase === "inhale" ? 0 : phase === "hold" ? 220 * (dotProgress / 100) : 220) + (phase === "hold" ? 0 : 0)}
              cy={phase === "inhale" ? 260 - 220 * (dotProgress / 100) : phase === "hold" ? 40 : 40 + 220 * (dotProgress / 100)}
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

          {/* Phase labels below progress bar */}
          <div
            className="w-full flex justify-between mt-2 text-xs"
          >
            <span
              className="transition-all duration-200"
              style={{
                color: phase === "inhale" ? "#2C3E50" : "#6B6B6B",
                fontWeight: phase === "inhale" ? 600 : 400,
              }}
            >
              Inhale (4s)
            </span>
            <span
              className="transition-all duration-200"
              style={{
                color: phase === "hold" ? "#2C3E50" : "#6B6B6B",
                fontWeight: phase === "hold" ? 600 : 400,
              }}
            >
              Hold (7s)
            </span>
            <span
              className="transition-all duration-200"
              style={{
                color: phase === "exhale" ? "#2C3E50" : "#6B6B6B",
                fontWeight: phase === "exhale" ? 600 : 400,
              }}
            >
              Exhale (8s)
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Breathing;