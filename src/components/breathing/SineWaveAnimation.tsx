import { useEffect, useRef, useMemo } from "react";

interface SineWaveAnimationProps {
  phase: "inhale" | "hold" | "exhale" | "rapid-inhale" | "rapid-exhale" | "retention" | "recovery";
  progress: number; // 0-100 within current phase
  totalCycleProgress: number; // 0-100 across all phases in cycle
}

const SineWaveAnimation = ({ phase, progress, totalCycleProgress }: SineWaveAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate dot position on sine wave
  const getDotPosition = useMemo(() => {
    const width = 300;
    const height = 200;
    const centerY = height / 2;
    const amplitude = 60;
    
    // X position moves with total cycle progress
    const x = (totalCycleProgress / 100) * width;
    
    // Y position depends on phase
    let y = centerY;
    
    if (phase === "inhale" || phase === "rapid-inhale" || phase === "recovery") {
      // Curve up (sine wave peak) - progress 0->100 means y goes from center to top
      const phaseProgress = progress / 100;
      y = centerY - amplitude * Math.sin(phaseProgress * Math.PI / 2);
    } else if (phase === "exhale" || phase === "rapid-exhale") {
      // Curve down (sine wave trough) - progress 0->100 means y goes from top to bottom (or center to bottom)
      const phaseProgress = progress / 100;
      y = centerY - amplitude + amplitude * 2 * Math.sin(phaseProgress * Math.PI / 2);
    } else if (phase === "hold") {
      // Straight line at top
      y = centerY - amplitude;
    } else if (phase === "retention") {
      // Straight line at bottom
      y = centerY + amplitude;
    }
    
    return { x: Math.max(10, Math.min(x, width - 10)), y };
  }, [phase, progress, totalCycleProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const amplitude = 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw guide lines (subtle)
    ctx.strokeStyle = "rgba(44, 62, 80, 0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    // Top guide
    ctx.beginPath();
    ctx.moveTo(0, centerY - amplitude);
    ctx.lineTo(width, centerY - amplitude);
    ctx.stroke();
    
    // Bottom guide
    ctx.beginPath();
    ctx.moveTo(0, centerY + amplitude);
    ctx.lineTo(width, centerY + amplitude);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw the sine wave path (completed portion)
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.beginPath();
    
    const currentX = getDotPosition.x;
    let lastY = centerY;
    
    // Draw path up to current position
    for (let x = 0; x <= currentX; x += 2) {
      const normalizedX = x / width;
      
      // Generate y based on where we are in the overall progress
      const pointProgress = normalizedX * 100;
      let y: number;
      
      // Simple sine wave that completes based on technique
      y = centerY - amplitude * Math.sin((pointProgress / 100) * Math.PI * 2);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      lastY = y;
    }
    
    ctx.stroke();
    
    // Draw remaining path (faded)
    ctx.strokeStyle = "rgba(44, 62, 80, 0.2)";
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(currentX, lastY);
    
    for (let x = currentX; x <= width; x += 2) {
      const normalizedX = x / width;
      const y = centerY - amplitude * Math.sin((normalizedX) * Math.PI * 2);
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
  }, [phase, progress, totalCycleProgress, getDotPosition]);

  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full h-auto"
        style={{ backgroundColor: "transparent" }}
      />
      {/* Moving dot */}
      <div
        className="absolute w-5 h-5 rounded-full transition-all duration-100 ease-linear"
        style={{
          backgroundColor: "#2C3E50",
          boxShadow: "0 2px 8px rgba(44, 62, 80, 0.4), 0 0 0 3px white",
          left: `${(getDotPosition.x / 300) * 100}%`,
          top: `${(getDotPosition.y / 200) * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default SineWaveAnimation;
