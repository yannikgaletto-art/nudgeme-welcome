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

// Updated question database (English)
const questions: Record<DoGoodScenario, string[]> = {
  date: [
    "What would you have wished someone had told you when you were still young?",
    "What are you currently learning that you're not very good at yet?",
    "What would you do if money were no object?",
    "What would you like to do less of?",
    "Which personal freedom do you defend the most?",
    "What was your last turning point?",
    "Who is influencing you the most right now?",
    "What are your top 3 thoughts that you think about most in everyday life?",
    "What was your most important lesson from your studies?",
    "What was the most beautiful moment of the week?",
  ],
  friends: [
    "What was the most important lesson from your studies?",
    "What is your picture of the month on your phone?",
    "When you receive good news, who do you tell first?",
    "When did you know that friends became your closest friends?",
    "What does love mean to you?",
    "Is there something right now that needs to be healed?",
    "When was the last time you experienced 'standstill' in your life?",
    "Which time in school was life-changing and traumatic?",
    "How old is your soul?",
    "What does 2026 look like in 5 words?",
  ],
  office: [
    "Which anecdote do you tell too often?",
    "When was the last time you taught someone something?",
    "How can I help you with XY?",
    "Who would I invite for coffee?",
    "How do you bridge a 10-minute waiting period?",
    "When was the last time you heard a 'no'?",
    "What has been your personal highlight in the last 6 months?",
    "When you feel overwhelmed, what helps you get back in balance?",
    "What made you smile today?",
    "If people gossip about you, what would they say?",
  ],
  home: [
    "Who would you rather have coffee with on the Himalayas? Barack Obama, Maja Göpel, or The Beatles?",
    "Can you write in ChatGPT: Tell me something about myself that I don't know yet?",
    "What does your YouTube algorithm say about you?",
    "What was one experience this week where you grew a little more?",
    "Tell me about something beautiful!",
  ],
  stranger: [
    "If you suddenly had free time right now, what would you do?",
    "What made you smile today?",
    "What are you thinking about right now?",
    "If I gave you 1.75 million euros in a backpack right now, tax-free, what would you do with it?",
    "How much do you believe in destiny?",
  ],
};

const strangerQuote = "You only fail, if you don't try";

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

        {/* Stranger quote - only shown for stranger scenario */}
        {scenario === "stranger" && (
          <p
            className="mt-6 text-lg italic font-medium text-center opacity-0"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#A7C4BC",
              animation: "fade-in 600ms ease-out forwards",
              animationDelay: "350ms",
            }}
          >
            "{strangerQuote}"
          </p>
        )}

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
        Let's do good?
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
