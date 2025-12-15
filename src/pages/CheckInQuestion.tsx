import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends";

// Question database - 10 questions per scenario (for refresh)
const questionDatabase: Record<DoGoodScenario, string[]> = {
  office: [
    "When was the last time you did something for the first time?",
    "What's your favorite spot to grab coffee?",
    "What made you smile this week?",
    "What's something you're looking forward to?",
    "What's a skill you'd love to learn?",
    "What's your go-to lunch spot?",
    "What's one thing you're proud of this month?",
    "What's your favorite way to start the day?",
    "What's a movie or book you'd recommend?",
    "What's something that surprised you recently?",
  ],
  home: [
    "What's one thing you're grateful for today?",
    "What's your favorite room in your home and why?",
    "What's a childhood memory that makes you smile?",
    "What's your comfort food?",
    "What's one thing that relaxes you instantly?",
    "What's a dream you still want to pursue?",
    "What's your favorite season and why?",
    "What's something you'd tell your younger self?",
    "What's a hobby you'd love to pick up?",
    "What's your ideal weekend like?",
  ],
  date: [
    "What's your favorite memory with this person?",
    "What's something that always makes you laugh?",
    "What's a place you dream of visiting together?",
    "What's your idea of a perfect evening?",
    "What's something you admire about them?",
    "What's a song that reminds you of them?",
    "What's your favorite shared experience?",
    "What's something new you'd like to try together?",
    "What's your love language?",
    "What's a goal you have as a couple?",
  ],
  stranger: [
    "What's the best part of your day so far?",
    "If you could travel anywhere right now, where?",
    "What's something you're passionate about?",
    "What's your favorite way to unwind?",
    "What's a random fun fact about you?",
    "What's the last thing that made you laugh?",
    "What's your favorite local spot around here?",
    "What's something you're working on right now?",
    "What's your hidden talent?",
    "What advice would you give your 18-year-old self?",
  ],
  friends: [
    "What's your favorite memory together?",
    "What's something you appreciate about our friendship?",
    "What's been on your mind lately?",
    "What's a goal you're working towards?",
    "What's something that made you happy this week?",
    "What's your current favorite song?",
    "What's a challenge you've overcome recently?",
    "What's something you'd like to do together soon?",
    "What's your biggest dream right now?",
    "What's something you're grateful for today?",
  ],
};

const CheckInQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = (location.state?.scenario as DoGoodScenario) || "office";
  const selectedQuestion = location.state?.selectedQuestion as string;

  const [currentState, setCurrentState] = useState<"question" | "completion">("question");
  const [currentQuestion, setCurrentQuestion] = useState<string>(selectedQuestion || "");
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(2);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Get Do Good count from localStorage
  const getDoGoodCount = useCallback(() => {
    const count = localStorage.getItem("nudgeme_do_good_count");
    return count ? parseInt(count, 10) : 0;
  }, []);

  const [doGoodCount, setDoGoodCount] = useState(getDoGoodCount);

  // Initialize with selected question from intro page
  useEffect(() => {
    if (selectedQuestion) {
      setCurrentQuestion(selectedQuestion);
      setUsedQuestions([selectedQuestion]);
    } else {
      // Fallback: pick random question
      const pool = questionDatabase[scenario] || questionDatabase.office;
      const question = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuestion(question);
      setUsedQuestions([question]);
    }
  }, [scenario, selectedQuestion]);

  const handleRefresh = useCallback(() => {
    if (refreshCounter > 0 && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        const pool = questionDatabase[scenario] || questionDatabase.office;
        const available = pool.filter((q) => !usedQuestions.includes(q));
        const newQuestion = available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : pool[Math.floor(Math.random() * pool.length)];
        
        setCurrentQuestion(newQuestion);
        setUsedQuestions((prev) => [...prev, newQuestion]);
        setRefreshCounter((prev) => prev - 1);
        setIsRefreshing(false);
      }, 300);
    }
  }, [refreshCounter, isRefreshing, scenario, usedQuestions]);

  const handleComplete = useCallback(() => {
    // Increment Do Good count
    const newCount = doGoodCount + 1;
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
        setProgressWidth(Math.min((newCount / 10) * 100, 100));
      }, 700);
    }, 500);
  }, [doGoodCount]);

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // STATE A: Question Display
  if (currentState === "question") {
    return (
      <main
        className={cn(
          "min-h-screen w-full flex flex-col items-center justify-between px-6 py-10 transition-all duration-300",
          isTransitioning && "opacity-0 scale-95"
        )}
        style={{ backgroundColor: "#F5E6D3" }}
      >
        {/* Signal Icon */}
        <div className="pt-10">
          <div className="animate-signal-pulse">
            <MessageCircle
              size={48}
              strokeWidth={2}
              className="md:w-14 md:h-14"
              style={{ color: "#A7C4BC" }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className={cn(
            "w-[90%] max-w-[500px] bg-white rounded-[20px] p-7 md:p-10",
            "transition-transform duration-200",
            isRefreshing && "animate-card-shake"
          )}
          style={{
            border: "2px solid #E5E7EB",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Question Text */}
          <p
            className="text-[22px] md:text-[26px] font-medium text-center leading-[1.5] mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
            }}
          >
            {currentQuestion || "Loading..."}
          </p>

          {/* Divider */}
          <div className="w-full h-px my-6" style={{ backgroundColor: "#E5E7EB" }} />

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshCounter === 0 || isRefreshing}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 transition-all duration-200",
              refreshCounter === 0 ? "opacity-40 cursor-not-allowed" : "hover:opacity-100 opacity-70"
            )}
            style={{ color: "#2C3E50" }}
          >
            <RefreshCw
              size={16}
              className={cn(
                "transition-transform duration-300",
                isRefreshing && "animate-spin"
              )}
            />
            <span className="text-sm font-medium">Try another question</span>
          </button>

          {/* Refresh Counter */}
          <p className="text-xs text-center mt-2" style={{ color: "#9CA3AF" }}>
            {refreshCounter > 0 ? `${refreshCounter} questions left` : "No more refreshes"}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleComplete}
          className="w-full max-w-[400px] h-14 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.05] mb-6"
          style={{
            backgroundColor: "#2C3E50",
            color: "white",
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          }}
        >
          I asked this question ✓
        </button>

        <style>{`
          @keyframes signal-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          
          @keyframes card-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          
          .animate-signal-pulse {
            animation: signal-pulse 1500ms ease-in-out infinite;
          }
          
          .animate-card-shake {
            animation: card-shake 200ms ease-in-out;
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
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full animate-confetti"
                  style={{
                    backgroundColor: ["#A7C4BC", "#2C3E50", "#F5E6D3", "#10B981"][i % 4],
                    animationDelay: `${i * 50}ms`,
                    "--angle": `${(i * 45)}deg`,
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
          {doGoodCount} of 10 Do Good actions
        </div>

        {/* Progress Bar */}
        <div
          className="mt-4 w-[70%] max-w-[280px] h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all duration-800 ease-out"
            style={{
              backgroundColor: "#10B981",
              width: `${progressWidth}%`,
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
        Back to Home
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
        
        .duration-800 {
          transition-duration: 800ms;
        }
      `}</style>
    </main>
  );
};

export default CheckInQuestion;
