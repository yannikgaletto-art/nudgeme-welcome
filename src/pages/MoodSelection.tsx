import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mood {
  id: string;
  emoji: string;
  label: string;
  gradient: string;
}

const moods: Mood[] = [
  { id: "overwhelmed", emoji: "😔", label: "Overwhelmed", gradient: "bg-gradient-overwhelmed" },
  { id: "anxious", emoji: "😰", label: "Anxious", gradient: "bg-gradient-anxious" },
  { id: "sad", emoji: "😢", label: "Sad", gradient: "bg-gradient-sad" },
  { id: "nervous", emoji: "😬", label: "Nervous", gradient: "bg-gradient-nervous" },
  { id: "neutral", emoji: "😐", label: "Neutral", gradient: "bg-gradient-neutral" },
  { id: "calm", emoji: "😌", label: "Calm", gradient: "bg-gradient-calm" },
  { id: "energized", emoji: "🚀", label: "Energized", gradient: "bg-gradient-energized" },
];

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

  return (
    <main className="min-h-screen bg-background flex flex-col animate-page-enter">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-background z-10 flex items-center justify-center px-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute left-5 top-7 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="font-sans font-semibold text-2xl text-foreground tracking-tight">
          How are you feeling?
        </h1>
      </header>

      {/* Mood Buttons Section */}
      <section className="pt-[100px] pb-32 px-6 flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-[380px] mx-auto flex flex-col gap-3">
          {moods.map((mood, index) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={cn(
                "w-full h-[68px] rounded-full flex items-center px-7 gap-5 transition-all duration-200 border-2 opacity-0 animate-fade-in",
                mood.gradient,
                selectedMood === mood.id
                  ? "border-foreground shadow-mood-selected scale-[1.02]"
                  : "border-transparent hover:scale-[1.03] hover:border-foreground/30 hover:shadow-mood-hover",
                selectedMood && selectedMood !== mood.id && "opacity-70",
                "active:scale-[0.97] active:brightness-95"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              aria-label={`Select ${mood.label} mood`}
              aria-selected={selectedMood === mood.id}
            >
              <span className="text-4xl" role="img" aria-hidden="true">
                {mood.emoji}
              </span>
              <span className="text-lg font-medium text-foreground">
                {mood.label}
              </span>
              {selectedMood === mood.id && (
                <Check
                  size={24}
                  className="ml-auto text-foreground animate-fade-in"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Continue Button */}
      {selectedMood && (
        <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center animate-slide-up-bounce">
          <Button
            variant="nudge"
            size="cta"
            onClick={handleContinue}
            className="max-w-[360px] shadow-continue"
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
