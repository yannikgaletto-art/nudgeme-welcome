import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Check, 
  CloudRain, 
  AlertCircle, 
  Frown, 
  Activity, 
  Minus, 
  Smile, 
  Rocket,
  Sparkles,
  Heart,
  Briefcase,
  Home,
  Users,
  UserPlus,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Mood {
  id: string;
  icon: LucideIcon;
  label: string;
}

const moods: Mood[] = [
  { id: "overwhelmed", icon: CloudRain, label: "Overwhelmed" },
  { id: "anxious", icon: AlertCircle, label: "Anxious" },
  { id: "sad", icon: Frown, label: "Sad" },
  { id: "nervous", icon: Activity, label: "Nervous" },
  { id: "neutral", icon: Minus, label: "Neutral" },
  { id: "calm", icon: Smile, label: "Calm" },
  { id: "energized", icon: Rocket, label: "Energized" },
];

interface Scenario {
  id: string;
  icon: LucideIcon;
  label: string;
}

const scenarios: Scenario[] = [
  { id: "office", icon: Briefcase, label: "Office" },
  { id: "home", icon: Home, label: "At Home" },
  { id: "date", icon: Heart, label: "On a Date" },
  { id: "stranger", icon: Users, label: "Stranger" },
  { id: "friends", icon: UserPlus, label: "Friends" },
];

type RewardType = "receive" | "do" | null;
type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends" | null;

const MoodSelection = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wantsReward, setWantsReward] = useState(false);
  const [rewardType, setRewardType] = useState<RewardType>(null);
  const [doGoodScenario, setDoGoodScenario] = useState<DoGoodScenario>(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleRewardToggle = () => {
    setWantsReward(!wantsReward);
    if (wantsReward) {
      setRewardType(null);
      setDoGoodScenario(null);
    }
  };

  const handleRewardTypeSelect = (type: RewardType) => {
    setRewardType(type);
    if (type === "receive") {
      setDoGoodScenario(null);
    }
  };

  const handleScenarioSelect = (scenarioId: DoGoodScenario) => {
    setDoGoodScenario(scenarioId);
  };

  const canContinue = 
    selectedMood !== null && 
    (!wantsReward || (rewardType !== null && (rewardType === "receive" || doGoodScenario !== null)));

  const handleContinue = () => {
    navigate("/breathing-selection", { 
      state: { 
        mood: selectedMood,
        wantsReward,
        rewardType,
        doGoodScenario
      } 
    });
  };

  return (
    <main className="min-h-screen flex flex-col animate-page-enter" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 z-10 flex items-center justify-center px-6" style={{ backgroundColor: "#F5E6D3" }}>
        <button 
          onClick={handleBack} 
          className="absolute left-5 top-7 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200" 
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 
          className="text-[32px] font-semibold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
        >
          How are you feeling?
        </h1>
      </header>

      {/* Content */}
      <section className="pt-[100px] pb-32 px-6 flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-[600px] mx-auto">
          {/* Mood Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {moods.map((mood, index) => {
              const isSelected = selectedMood === mood.id;
              const IconComponent = mood.icon;
              
              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={cn(
                    "relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] mx-auto",
                    "rounded-2xl flex flex-col items-center justify-center",
                    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "border-2 opacity-0 animate-fade-in",
                    isSelected 
                      ? "bg-[#2C3E50] border-[#2C3E50] shadow-lg" 
                      : "bg-transparent border-[#2C3E50] hover:bg-[#2C3E50]/5 hover:scale-[1.02]",
                    "active:scale-95"
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                  aria-label={`Select ${mood.label} mood`}
                  aria-selected={isSelected}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                  <IconComponent 
                    size={36} 
                    strokeWidth={2}
                    className={cn(
                      "mb-3 transition-colors duration-300",
                      isSelected ? "text-white" : "text-[#2C3E50]"
                    )} 
                  />
                  <span className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isSelected ? "text-white" : "text-[#2C3E50]"
                  )}>
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reward Question */}
          {selectedMood && (
            <div className="mt-8 animate-fade-in" style={{ animationDuration: "300ms" }}>
              <button
                onClick={handleRewardToggle}
                className="flex items-center gap-3 w-full text-left group"
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                  wantsReward 
                    ? "bg-[#2C3E50] border-[#2C3E50]" 
                    : "border-[#2C3E50] bg-transparent"
                )}>
                  {wantsReward && <Check size={12} className="text-white" />}
                </div>
                <span className="text-base font-medium text-[#2C3E50]">
                  Would you like a reward after breathing?
                </span>
              </button>

              {/* Reward Options */}
              {wantsReward && (
                <div className={cn(
                  "mt-4 grid gap-4",
                  rewardType === null ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}>
                  {/* Receive Good Card */}
                  {(rewardType === null || rewardType === "receive") && (
                    <button
                      onClick={() => handleRewardTypeSelect("receive")}
                      className={cn(
                        "relative h-[120px] rounded-2xl flex flex-col items-center justify-center",
                        "border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        "animate-fade-in",
                        rewardType === "receive"
                          ? "bg-[#2C3E50] border-[#2C3E50] shadow-md w-full"
                          : "bg-transparent border-[#2C3E50] hover:bg-[#2C3E50]/5 hover:scale-[1.02]"
                      )}
                    >
                      {rewardType === "receive" && (
                        <div className="absolute top-2 right-2 animate-fade-in">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      <Sparkles size={32} strokeWidth={2} className={cn("mb-2 transition-colors duration-300", rewardType === "receive" ? "text-white" : "text-[#2C3E50]")} />
                      <span className={cn("text-sm font-semibold transition-colors duration-300", rewardType === "receive" ? "text-white" : "text-[#2C3E50]")}>Receive Good</span>
                    </button>
                  )}

                  {/* Do Good Card */}
                  {(rewardType === null || rewardType === "do") && (
                    <button
                      onClick={() => handleRewardTypeSelect("do")}
                      className={cn(
                        "relative h-[120px] rounded-2xl flex flex-col items-center justify-center",
                        "border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        "animate-fade-in",
                        rewardType === "do"
                          ? "bg-[#2C3E50] border-[#2C3E50] shadow-md w-full"
                          : "bg-transparent border-[#2C3E50] hover:bg-[#2C3E50]/5 hover:scale-[1.02]"
                      )}
                    >
                      {rewardType === "do" && (
                        <div className="absolute top-2 right-2 animate-fade-in">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      <Heart size={32} strokeWidth={2} className={cn("mb-2 transition-colors duration-300", rewardType === "do" ? "text-white" : "text-[#2C3E50]")} />
                      <span className={cn("text-sm font-semibold transition-colors duration-300", rewardType === "do" ? "text-white" : "text-[#2C3E50]")}>Do Good</span>
                    </button>
                  )}
                </div>
              )}

              {/* Do Good Scenarios */}
              {rewardType === "do" && (
                <div 
                  className="mt-4 grid grid-cols-2 gap-3 animate-fade-in"
                  style={{ animationDuration: "300ms" }}
                >
                  {scenarios.map((scenario) => {
                    const isSelected = doGoodScenario === scenario.id;
                    const IconComponent = scenario.icon;
                    
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => handleScenarioSelect(scenario.id as DoGoodScenario)}
                        className={cn(
                          "relative h-[100px] rounded-2xl flex flex-col items-center justify-center",
                          "border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                          isSelected
                            ? "bg-[#2C3E50] border-[#2C3E50] shadow-md"
                            : "bg-transparent border-[#2C3E50] hover:bg-[#2C3E50]/5 hover:scale-[1.02]"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 animate-fade-in">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                        <IconComponent 
                          size={28} 
                          strokeWidth={2} 
                          className={cn("mb-2 transition-colors duration-300", isSelected ? "text-white" : "text-[#2C3E50]")} 
                        />
                        <span className={cn("text-[13px] font-medium transition-colors duration-300", isSelected ? "text-white" : "text-[#2C3E50]")}>
                          {scenario.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Continue Button */}
      {canContinue && (
        <div 
          className="fixed bottom-8 left-0 right-0 px-6 flex justify-center animate-slide-up-bounce"
          style={{ animationDuration: "400ms" }}
        >
          <Button 
            onClick={handleContinue}
            className={cn(
              "h-14 rounded-full px-8",
              "bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white",
              "max-w-[400px] w-full",
              "shadow-lg"
            )}
            aria-label="Continue to breathing exercise"
          >
            Continue
          </Button>
        </div>
      )}
    </main>
  );
};

export default MoodSelection;
