import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
interface Mood {
  id: string;
  emoji: string;
  label: string;
}
const moods: Mood[] = [{
  id: "overwhelmed",
  emoji: "😔",
  label: "Overwhelmed"
}, {
  id: "anxious",
  emoji: "😰",
  label: "Anxious"
}, {
  id: "sad",
  emoji: "😢",
  label: "Sad"
}, {
  id: "nervous",
  emoji: "😬",
  label: "Nervous"
}, {
  id: "neutral",
  emoji: "😐",
  label: "Neutral"
}, {
  id: "calm",
  emoji: "😌",
  label: "Calm"
}, {
  id: "energized",
  emoji: "🚀",
  label: "Energized"
}];
const MoodSelection = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const handleBack = () => {
    navigate("/");
  };
  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };
  const handleContinue = () => {
    // Future: Navigate to breathing screen with selected mood
    console.log("Continuing with mood:", selectedMood);
  };
  return <main className="min-h-screen bg-background flex flex-col animate-page-enter">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-background z-10 flex items-center justify-center px-6">
        {/* Back Button */}
        <button onClick={handleBack} className="absolute left-5 top-7 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="Go back to welcome screen">
          <ArrowLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="font-sans font-semibold text-foreground tracking-tight text-4xl">
          How are you feeling?
        </h1>
      </header>

      {/* Mood Cards Grid */}
      <section className="pt-[100px] pb-32 px-6 flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-[400px] mx-auto grid grid-cols-2 gap-4 max-[360px]:grid-cols-1">
          {moods.map((mood, index) => {
          const isSelected = selectedMood === mood.id;
          return <button key={mood.id} role="button" onClick={() => handleMoodSelect(mood.id)} className={cn("relative aspect-square rounded-[20px] flex flex-col items-center justify-center p-6 transition-all duration-200 border-[3px] opacity-0 animate-fade-in", isSelected ? "bg-foreground border-foreground shadow-mood-selected" : "bg-background border-foreground hover:scale-105 hover:border-[4px] hover:shadow-mood-hover", "active:scale-95")} style={{
            animationDelay: `${index * 50}ms`
          }} aria-label={`Select ${mood.label} mood`} aria-selected={isSelected}>
                {/* Checkmark for selected state */}
                {isSelected && <div className="absolute top-3 right-3 animate-fade-in">
                    <Check size={20} className="text-background" />
                  </div>}
                
                {/* Emoji */}
                <span className="text-5xl mb-4" role="img" aria-hidden="true">
                  {mood.emoji}
                </span>
                
                {/* Label */}
                <span className={cn("text-base font-medium transition-colors duration-200", isSelected ? "text-background" : "text-foreground")}>
                  {mood.label}
                </span>
              </button>;
        })}
        </div>
      </section>

      {/* Continue Button */}
      {selectedMood && <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center animate-slide-up-bounce">
          <Button variant="nudge" size="cta" onClick={handleContinue} className="max-w-[360px] shadow-continue" aria-label="Continue to breathing exercise">
            Continue
          </Button>
        </div>}
    </main>;
};
export default MoodSelection;