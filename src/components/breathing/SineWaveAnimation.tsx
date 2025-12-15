import { useMemo } from "react";

interface BreathingPhase {
  name: "inhale" | "hold" | "exhale" | "rapid-inhale" | "rapid-exhale" | "retention" | "recovery" | "double-inhale" | "hold2";
  duration: number;
}

interface SineWaveAnimationProps {
  phases: BreathingPhase[];
  currentPhaseIndex: number;
  phaseProgress: number; // 0-100 within current phase
  cycleProgress: number; // 0-100 across entire cycle
}

const SineWaveAnimation = ({ phases, currentPhaseIndex, phaseProgress, cycleProgress }: SineWaveAnimationProps) => {
  const width = 320;
  const height = 160;
  const centerY = height / 2;
  const amplitude = 50;

  // Calculate total duration and phase positions
  const { totalDuration, phasePositions } = useMemo(() => {
    const total = phases.reduce((sum, p) => sum + p.duration, 0);
    let accumulated = 0;
    const positions = phases.map((phase) => {
      const start = accumulated / total;
      accumulated += phase.duration;
      const end = accumulated / total;
      return { phase, start, end, width: (phase.duration / total) * width };
    });
    return { totalDuration: total, phasePositions: positions };
  }, [phases, width]);

  // Get Y position at a given phase and progress within that phase
  const getYAtPhaseProgress = (phaseName: string, progress: number, prevY: number): number => {
    const t = progress / 100;
    
    if (phaseName === "inhale" || phaseName === "rapid-inhale" || phaseName === "recovery" || phaseName === "double-inhale") {
      // Going UP from current position to top
      return centerY - amplitude * Math.sin(t * Math.PI / 2);
    }
    
    if (phaseName === "exhale" || phaseName === "rapid-exhale") {
      // Going DOWN from top to bottom (crossing center)
      return centerY - amplitude * Math.cos(t * Math.PI / 2);
    }
    
    if (phaseName === "hold") {
      // Stay at top
      return centerY - amplitude;
    }
    
    if (phaseName === "retention" || phaseName === "hold2") {
      // Stay at bottom
      return centerY + amplitude;
    }
    
    return centerY;
  };

  // Generate the full curve path based on phases
  const generatePath = useMemo(() => {
    let pathD = "";
    let currentX = 0;
    let lastY = centerY;

    phasePositions.forEach(({ phase, width: phaseWidth }, index) => {
      const startX = currentX;
      const endX = currentX + phaseWidth;
      const steps = Math.max(20, Math.round(phaseWidth / 2));

      for (let i = 0; i <= steps; i++) {
        const progress = (i / steps) * 100;
        const x = startX + (i / steps) * phaseWidth;
        const y = getYAtPhaseProgress(phase.name, progress, lastY);

        if (index === 0 && i === 0) {
          pathD = `M ${x} ${y}`;
        } else {
          pathD += ` L ${x} ${y}`;
        }
        
        if (i === steps) {
          lastY = y;
        }
      }
      
      currentX = endX;
    });

    return pathD;
  }, [phasePositions, centerY, amplitude]);

  // Calculate current dot position using SAME formula
  const dotPosition = useMemo(() => {
    const currentPhase = phases[currentPhaseIndex];
    if (!currentPhase) return { x: 0, y: centerY };

    // Calculate X position based on cycle progress
    const x = (cycleProgress / 100) * width;

    // Calculate Y using same formula as path generation
    const y = getYAtPhaseProgress(currentPhase.name, phaseProgress, centerY);

    return { 
      x: Math.max(10, Math.min(x, width - 10)), 
      y 
    };
  }, [currentPhaseIndex, phaseProgress, cycleProgress, phases, width, centerY, amplitude]);

  // Calculate how much of the path to show (completed portion)
  const pathLength = width * 1.5; // Approximate path length
  const completedLength = (cycleProgress / 100) * pathLength;

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
        
        {/* Background wave path (faded) */}
        <path
          d={generatePath}
          fill="none"
          stroke="rgba(44, 62, 80, 0.15)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Active wave path (completed portion) */}
        <path
          d={generatePath}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - completedLength}
        />
        
        {/* Moving dot - positioned using same formula */}
        <circle
          cx={dotPosition.x}
          cy={dotPosition.y}
          r="10"
          fill="#2C3E50"
          stroke="white"
          strokeWidth="3"
          style={{
            filter: "drop-shadow(0 2px 6px rgba(44, 62, 80, 0.3))",
          }}
        />
      </svg>
    </div>
  );
};

export default SineWaveAnimation;
