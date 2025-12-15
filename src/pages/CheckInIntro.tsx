import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Home, Heart, Users, UserPlus, RefreshCw, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends";

const scenarioConfig: Record<DoGoodScenario, { icon: LucideIcon; label: string }> = {
  office: { icon: Briefcase, label: "Office" },
  home: { icon: Home, label: "At Home" },
  date: { icon: Heart, label: "On a Date" },
  stranger: { icon: Users, label: "Stranger" },
  friends: { icon: UserPlus, label: "Friends" },
};

// Question database per scenario
const questions: Record<DoGoodScenario, string[]> = {
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

const CheckInIntro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = (location.state?.scenario as DoGoodScenario) || "office";
  
  const config = scenarioConfig[scenario] || scenarioConfig.office;
  const IconComponent = config.icon;

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(2);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCardShaking, setIsCardShaking] = useState(false);

  // Get random question that hasn't been used
  const getRandomQuestion = (exclude: number[]): { question: string; index: number } => {
    const scenarioQuestions = questions[scenario] || questions.office;
    const availableIndices = scenarioQuestions
      .map((_, i) => i)
      .filter(i => !exclude.includes(i));
    
    if (availableIndices.length === 0) {
      // Reset if all used
      const randomIndex = Math.floor(Math.random() * scenarioQuestions.length);
      return { question: scenarioQuestions[randomIndex], index: randomIndex };
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { question: scenarioQuestions[randomIndex], index: randomIndex };
  };

  // Load first question on mount
  useEffect(() => {
    const { question, index } = getRandomQuestion([]);
    setCurrentQuestion(question);
    setUsedIndices([index]);
  }, [scenario]);

  const handleRefresh = () => {
    if (refreshCounter > 0) {
      setIsRefreshing(true);
      setIsCardShaking(true);
      
      setTimeout(() => {
        const { question, index } = getRandomQuestion(usedIndices);
        setCurrentQuestion(question);
        setUsedIndices([...usedIndices, index]);
        setRefreshCounter(refreshCounter - 1);
        setIsRefreshing(false);
        setIsCardShaking(false);
      }, 300);
    }
  };

  const handleReady = () => {
    navigate("/check-in/countdown", { 
      state: { 
        scenario,
        selectedQuestion: currentQuestion 
      } 
    });
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Top section with title and badge */}
      <div className="flex-1 flex flex-col items-center pt-16">
        {/* Title */}
        <h1
          className={cn(
            "text-[28px] md:text-[32px] font-semibold text-center leading-[1.3] tracking-[-0.4px]",
            "opacity-0"
          )}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
            animation: "fade-in 400ms ease-out forwards",
          }}
        >
          Let's go to your check-in
        </h1>

        {/* Scenario badge - transparent with navy border */}
        <div
          className={cn(
            "mt-8 inline-flex items-center gap-3 px-8 py-3.5 rounded-full",
            "opacity-0"
          )}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #2C3E50",
            animation: "scale-fade-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            animationDelay: "200ms",
          }}
        >
          <IconComponent
            size={24}
            strokeWidth={2}
            style={{ color: "#2C3E50" }}
          />
          <span
            className="text-xl font-semibold"
            style={{ color: "#2C3E50" }}
          >
            {config.label}
          </span>
        </div>

        {/* Question card */}
        <div
          className={cn(
            "mt-8 w-full max-w-[500px] rounded-[20px] p-8 md:p-10",
            "opacity-0",
            isCardShaking && "animate-shake"
          )}
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #E5E7EB",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
            animation: "slide-up-fade 600ms ease-out forwards",
            animationDelay: "400ms",
          }}
        >
          {/* Question text */}
          <p
            className="text-[22px] md:text-[26px] font-medium text-center leading-[1.5]"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
            }}
          >
            {currentQuestion}
          </p>

          {/* Divider */}
          <div
            className="w-full h-px my-6"
            style={{ backgroundColor: "#E5E7EB" }}
          />

          {/* Refresh button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleRefresh}
              disabled={refreshCounter === 0}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                refreshCounter === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-100"
              )}
              style={{ 
                color: "rgba(44, 62, 80, 0.7)",
                background: "transparent",
                border: "none",
              }}
            >
              <RefreshCw
                size={16}
                className={cn(
                  "transition-transform duration-300",
                  isRefreshing && "rotate-180"
                )}
              />
              Try another question
            </button>
            
            <span
              className="text-xs mt-2"
              style={{ color: "#9CA3AF" }}
            >
              {refreshCounter > 0 ? `${refreshCounter} questions left` : "No more refreshes"}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleReady}
        className={cn(
          "w-full max-w-[400px] h-14 rounded-full text-base font-semibold",
          "transition-all duration-200 hover:scale-[1.05]",
          "opacity-0"
        )}
        style={{
          backgroundColor: "#2C3E50",
          color: "white",
          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          animation: "slide-up-fade 400ms ease-out forwards",
          animationDelay: "800ms",
        }}
      >
        Let's do good
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up-fade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .animate-shake {
          animation: shake 300ms ease-in-out;
        }
      `}</style>
    </main>
  );
};

export default CheckInIntro;
