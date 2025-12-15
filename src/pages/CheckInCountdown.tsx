import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends";

const CheckInCountdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state?.scenario as DoGoodScenario;
  const selectedQuestion = location.state?.selectedQuestion as string;
  
  const [countdown, setCountdown] = useState(5);
  const [isLaunching, setIsLaunching] = useState(false);
  const [numberKey, setNumberKey] = useState(0);

  // Determine animation phase based on countdown
  const getAnimationPhase = useCallback(() => {
    if (countdown === 0) return "launch";
    if (countdown <= 2) return "shake";
    return "pulse";
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLaunching(true);
          // Navigate after launch animation
          setTimeout(() => {
            navigate("/check-in/question", { 
              state: { 
                scenario,
                selectedQuestion 
              } 
            });
          }, 900);
          return 0;
        }
        setNumberKey((k) => k + 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, scenario, selectedQuestion]);

  const phase = getAnimationPhase();

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              backgroundColor: "#2C3E50",
              left: `${10 + Math.random() * 80}%`,
              bottom: `${Math.random() * 100}%`,
              animation: `float-up ${8 + Math.random() * 4}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center">
        {/* Rocket icon */}
        <div
          className={cn(
            "transition-transform",
            phase === "pulse" && "animate-rocket-pulse",
            phase === "shake" && "animate-rocket-shake",
            isLaunching && "animate-rocket-launch"
          )}
        >
          <Rocket
            size={80}
            strokeWidth={2}
            style={{ color: "#2C3E50" }}
            className="md:w-[100px] md:h-[100px]"
          />
        </div>

        {/* Countdown number */}
        <div
          key={numberKey}
          className={cn(
            "mt-8 text-[80px] md:text-[96px] font-bold",
            "animate-number-bounce"
          )}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          {countdown}
        </div>

        {/* Label */}
        <p
          className="mt-5 text-lg"
          style={{ color: "#6B7280" }}
        >
          Get ready...
        </p>
      </div>

      <style>{`
        @keyframes float-up {
          from {
            transform: translateY(0);
            opacity: 0.3;
          }
          to {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        
        @keyframes rocket-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes rocket-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes rocket-launch {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes number-bounce {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-rocket-pulse {
          animation: rocket-pulse 800ms ease-in-out infinite;
        }
        
        .animate-rocket-shake {
          animation: rocket-shake 200ms ease-in-out infinite;
        }
        
        .animate-rocket-launch {
          animation: rocket-launch 600ms ease-in forwards;
        }
        
        .animate-number-bounce {
          animation: number-bounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </main>
  );
};

export default CheckInCountdown;
