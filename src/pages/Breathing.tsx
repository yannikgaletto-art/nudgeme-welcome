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
        {/* Instruction text above path */}
        <div
          className="mb-[60px] text-center transition-all duration-400"
          style={{
            transform: textPulse ? "scale(1.08)" : "scale(1)",
          }}
        >
          <p
            className="text-[28px] md:text-[32px] font-semibold tracking-[-0.5px] animate-fade-in"
            style={{ color: "#2C3E50" }}
          >
            {phaseConfig[phase].text}
          </p>
        </div>

        {/* Box path visualization - larger */}
        <svg
          width="360"
          height="320"
          viewBox="0 0 360 320"
          className="animate-scale-in w-[85vw] max-w-[360px] h-auto"
        >
          {/* Segment 1: A→B (Inhale) - vertical up */}
          <path
            d={`M ${PATH.A.x} ${PATH.A.y} L ${PATH.B.x} ${PATH.B.y}`}
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
            d={`M ${PATH.B.x} ${PATH.B.y} L ${PATH.C.x} ${PATH.C.y}`}
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
            d={`M ${PATH.C.x} ${PATH.C.y} L ${PATH.D.x} ${PATH.D.y}`}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            style={{
              ...getSegmentStyle("exhale"),
              transition: "all 300ms ease",
            }}
          />

          {/* Corner labels - text only, no circles */}
          {[
            { point: PATH.A, label: "A", offset: { x: -20, y: 8 } },
            { point: PATH.B, label: "B", offset: { x: -20, y: 0 } },
            { point: PATH.C, label: "C", offset: { x: 20, y: 0 } },
            { point: PATH.D, label: "D", offset: { x: 20, y: 8 } },
          ].map(({ point, label, offset }) => (
            <text
              key={label}
              x={point.x + offset.x}
              y={point.y + offset.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
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
            r="12"
            fill="#2C3E50"
            stroke="white"
            strokeWidth="4"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(44, 62, 80, 0.3))",
              transition: "cx 100ms linear, cy 100ms linear",
            }}
          />
        </svg>

        {/* Countdown timer below path */}
        <div
          className="mt-20 flex items-center justify-center rounded-full"
          style={{
            width: "100px",
            height: "100px",
            border: "2px solid #2C3E50",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <span
            className="text-[52px] font-semibold transition-transform"
            style={{
              color: "#2C3E50",
              transform: timerPulse ? "scale(1.12)" : "scale(1)",
              transitionDuration: "200ms",
              transitionTimingFunction: "ease-out",
            }}
          >
            {phaseTimeLeft}
          </span>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-12 left-10 right-10 flex flex-col items-center">
        {/* Phase labels above progress bar */}
        <div
          className="w-full max-w-[480px] flex justify-between mb-2 text-[11px] font-medium"
          style={{ color: "#6B6B6B" }}
        >
          <span>Inhale (4s)</span>
          <span>Hold (7s)</span>
          <span>Exhale (8s)</span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full max-w-[480px] h-3 rounded-md overflow-hidden"
          style={{ backgroundColor: "rgba(44, 62, 80, 0.2)" }}
        >
          <div
            className="h-full rounded-md"
            style={{
              width: `${totalProgress}%`,
              backgroundColor: "#2C3E50",
              transition: "width 1000ms linear",
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Breathing;