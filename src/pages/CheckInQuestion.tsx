import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PartyPopper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends";

const CheckInQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = (location.state?.scenario as DoGoodScenario) || "office";
  const selectedQuestion = location.state?.selectedQuestion as string;

  const [currentState, setCurrentState] = useState<"question" | "completion">("question");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Get Do Good count from localStorage
  const getDoGoodCount = useCallback(() => {
    const count = localStorage.getItem("nudgeme_do_good_count");
    return count ? parseInt(count, 10) : 0;
  }, []);

  const [doGoodCount, setDoGoodCount] = useState(getDoGoodCount);

  const handleComplete = useCallback(() => {
    // Increment Do Good count (max 3)
    const newCount = Math.min(doGoodCount + 1, 3);
    localStorage.setItem("nudgeme_do_good_count", newCount.toString());
    setDoGoodCount(newCount);

    // Start transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentState("completion");
      setIsTransitioning(false);
      setShowConfetti(true);
      // Animate progress bar after delay
      setTimeout(() => {
        setProgressWidth((newCount / 3) * 100);
      }, 700);
    }, 500);
  }, [doGoodCount]);

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const getBadgeText = (count: number) => {
    if (count === 3) return "3 out of 3 Do Good actions - Complete!";
    return `${count} out of 3 Do Good actions`;
  };

  const getButtonText = (count: number) => {
    const countWords = ['', 'One', 'Two', 'Three'];
    return `${countWords[count]} good deed${count > 1 ? 's' : ''} a day`;
  };

  // STATE A: Fullscreen Question Display
  if (currentState === "question") {
    return (
      <main
        className={cn(
          "min-h-screen w-full flex flex-col items-center justify-center px-8 py-10 transition-all duration-300",
          isTransitioning && "opacity-0 scale-95"
        )}
        style={{ backgroundColor: "#F5E6D3" }}
      >
        {/* Question text - fullscreen centered, no card */}
        <p
          className="text-[28px] md:text-[36px] font-medium text-center leading-[1.6] max-w-[600px] opacity-0"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
            animation: "question-fade-in 600ms ease-out forwards",
          }}
        >
          {selectedQuestion || "Loading..."}
        </p>

        {/* Action Button - fixed at bottom */}
        <button
          onClick={handleComplete}
          className="fixed bottom-[60px] left-1/2 -translate-x-1/2 inline-flex items-center justify-center gap-3 h-14 px-12 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.05] opacity-0"
          style={{
            backgroundColor: "#2C3E50",
            color: "white",
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
            maxWidth: "calc(100% - 48px)",
            animation: "slide-up-fade 400ms ease-out forwards",
            animationDelay: "400ms",
          }}
        >
          <PartyPopper size={24} />
          Done good?
        </button>

        <style>{`
          @keyframes question-fade-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes slide-up-fade {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}</style>
      </main>
    );
  }

  // STATE B: Completion Celebration
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-between px-6 py-10"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Success Icon with Confetti */}
        <div className="relative">
          <Sparkles
            size={64}
            strokeWidth={2}
            className="md:w-20 md:h-20 animate-success-icon"
            style={{ color: "#10B981" }}
          />
          
          {/* Confetti Particles */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full animate-confetti"
                  style={{
                    backgroundColor: ["#A7C4BC", "#2C3E50", "#F5E6D3", "#10B981"][i % 4],
                    animationDelay: `${i * 50}ms`,
                    "--angle": `${(i * 36)}deg`,
                    "--distance": `${50 + Math.random() * 30}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          className="mt-5 text-[28px] md:text-[32px] font-semibold text-center opacity-0 animate-fade-in-delay-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          Great job!
        </h1>

        {/* Encouragement Text */}
        <p
          className="mt-3 text-base text-center opacity-0 animate-fade-in-delay-2"
          style={{ color: "#6B7280" }}
        >
          You stepped out of your comfort zone today
        </p>

        {/* Progress Badge */}
        <div
          className="mt-6 px-5 py-2.5 rounded-2xl text-sm font-semibold opacity-0 animate-slide-up-delay"
          style={{
            backgroundColor: "#D1FAE5",
            color: "#065F46",
          }}
        >
          {getBadgeText(doGoodCount)}
        </div>

        {/* Progress Bar */}
        <div
          className="mt-4 w-[70%] max-w-[280px] h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all ease-out"
            style={{
              backgroundColor: "#10B981",
              width: `${progressWidth}%`,
              transitionDuration: "800ms",
            }}
          />
        </div>
      </div>

      {/* Home Button */}
      <button
        onClick={handleBackToHome}
        className="w-full max-w-[400px] h-14 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.05] mb-6 opacity-0 animate-fade-in-delay-4"
        style={{
          backgroundColor: "#2C3E50",
          color: "white",
          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
        }}
      >
        {getButtonText(doGoodCount)}
      </button>

      <style>{`
        @keyframes success-icon {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + cos(var(--angle)) * var(--distance)),
              calc(-50% + sin(var(--angle)) * var(--distance))
            ) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes fade-in-delay-1 {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-success-icon {
          animation: success-icon 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-confetti {
          animation: confetti 800ms ease-out forwards;
        }
        
        .animate-fade-in-delay-1 {
          animation: fade-in-delay-1 400ms ease-out forwards;
          animation-delay: 300ms;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in-delay-1 400ms ease-out forwards;
          animation-delay: 400ms;
        }
        
        .animate-slide-up-delay {
          animation: slide-up-delay 400ms ease-out forwards;
          animation-delay: 500ms;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in-delay-1 400ms ease-out forwards;
          animation-delay: 1200ms;
        }
      `}</style>
    </main>
  );
};

export default CheckInQuestion;
