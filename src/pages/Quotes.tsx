import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Share2, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

interface Quote {
  id: string;
  text: string;
  author: string;
  voice: "stoic" | "mindful" | "modern";
  primaryMood: MoodType;
  intentTags: string[];
  gradient: number;
}

const moodEmojis: Record<MoodType, string> = {
  overwhelmed: "😵",
  anxious: "😰",
  sad: "😢",
  nervous: "😬",
  neutral: "😐",
  calm: "😌",
  energized: "⚡",
};

const moodLabels: Record<MoodType, string> = {
  overwhelmed: "Overwhelmed",
  anxious: "Anxious",
  sad: "Sad",
  nervous: "Nervous",
  neutral: "Neutral",
  calm: "Calm",
  energized: "Energized",
};

const quotes: Quote[] = [
  // OVERWHELMED quotes
  {
    id: "1",
    text: "You have power over your mind—not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    voice: "stoic",
    primaryMood: "overwhelmed",
    intentTags: ["control", "strength", "perspective"],
    gradient: 2
  },
  {
    id: "2",
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    voice: "modern",
    primaryMood: "overwhelmed",
    intentTags: ["rest", "perspective", "clarity"],
    gradient: 4
  },
  {
    id: "3",
    text: "You are the sky. Everything else is just the weather.",
    author: "Pema Chödrön",
    voice: "mindful",
    primaryMood: "overwhelmed",
    intentTags: ["perspective", "peace", "acceptance"],
    gradient: 3
  },
  // ANXIOUS quotes
  {
    id: "4",
    text: "Breathing in, I calm body and mind. Breathing out, I smile.",
    author: "Thich Nhat Hanh",
    voice: "mindful",
    primaryMood: "anxious",
    intentTags: ["calm", "breathing", "present"],
    gradient: 3
  },
  {
    id: "5",
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    voice: "stoic",
    primaryMood: "anxious",
    intentTags: ["calm", "perspective", "reality"],
    gradient: 6
  },
  {
    id: "6",
    text: "Nothing diminishes anxiety faster than action.",
    author: "Walter Anderson",
    voice: "modern",
    primaryMood: "anxious",
    intentTags: ["action", "calm", "momentum"],
    gradient: 7
  },
  // SAD quotes
  {
    id: "7",
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    voice: "mindful",
    primaryMood: "sad",
    intentTags: ["hope", "growth", "resilience"],
    gradient: 5
  },
  {
    id: "8",
    text: "Sometimes the bad things that happen in our lives put us directly on the path to the best things that will ever happen to us.",
    author: "Nicole Reed",
    voice: "modern",
    primaryMood: "sad",
    intentTags: ["hope", "perspective", "growth"],
    gradient: 4
  },
  {
    id: "9",
    text: "The best revenge is not to be like your enemy.",
    author: "Marcus Aurelius",
    voice: "stoic",
    primaryMood: "sad",
    intentTags: ["strength", "perspective", "dignity"],
    gradient: 1
  },
  // NERVOUS quotes
  {
    id: "10",
    text: "The courage to be vulnerable is not about winning or losing, it's about showing up.",
    author: "Brené Brown",
    voice: "modern",
    primaryMood: "nervous",
    intentTags: ["courage", "confidence", "acceptance"],
    gradient: 5
  },
  {
    id: "11",
    text: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus",
    voice: "stoic",
    primaryMood: "nervous",
    intentTags: ["control", "reassurance", "strength"],
    gradient: 2
  },
  {
    id: "12",
    text: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    voice: "mindful",
    primaryMood: "nervous",
    intentTags: ["present", "control", "calm"],
    gradient: 3
  },
  // NEUTRAL quotes
  {
    id: "13",
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass",
    voice: "mindful",
    primaryMood: "neutral",
    intentTags: ["wisdom", "reflection", "peace"],
    gradient: 6
  },
  {
    id: "14",
    text: "Be where you are; otherwise you will miss your life.",
    author: "Buddha",
    voice: "mindful",
    primaryMood: "neutral",
    intentTags: ["present", "wisdom", "mindfulness"],
    gradient: 3
  },
  {
    id: "15",
    text: "The cost of a thing is the amount of life you exchange for it.",
    author: "Henry David Thoreau",
    voice: "modern",
    primaryMood: "neutral",
    intentTags: ["wisdom", "perspective", "values"],
    gradient: 1
  },
  // CALM quotes
  {
    id: "16",
    text: "A calm mind, a fit body, and a house full of love. These things cannot be bought—they must be earned.",
    author: "Naval Ravikant",
    voice: "modern",
    primaryMood: "calm",
    intentTags: ["gratitude", "contentment", "values"],
    gradient: 7
  },
  {
    id: "17",
    text: "When you realize there is nothing lacking, the whole world belongs to you.",
    author: "Lao Tzu",
    voice: "mindful",
    primaryMood: "calm",
    intentTags: ["contentment", "peace", "gratitude"],
    gradient: 3
  },
  {
    id: "18",
    text: "He who is not satisfied with a little, is satisfied with nothing.",
    author: "Epicurus",
    voice: "stoic",
    primaryMood: "calm",
    intentTags: ["contentment", "gratitude", "wisdom"],
    gradient: 6
  },
  // ENERGIZED quotes
  {
    id: "19",
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    voice: "modern",
    primaryMood: "energized",
    intentTags: ["action", "systems", "achievement"],
    gradient: 7
  },
  {
    id: "20",
    text: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca",
    voice: "stoic",
    primaryMood: "energized",
    intentTags: ["action", "preparation", "momentum"],
    gradient: 4
  },
  {
    id: "21",
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    voice: "mindful",
    primaryMood: "energized",
    intentTags: ["action", "beginning", "momentum"],
    gradient: 5
  }
];

const Quotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as MoodType) || "calm";

  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);

  // Filter quotes by mood on mount
  useEffect(() => {
    const moodQuotes = quotes.filter(q => q.primaryMood === mood);
    setFilteredQuotes(moodQuotes);
    
    // Load saved quotes from localStorage
    const saved = localStorage.getItem("savedQuotes");
    if (saved) setSavedQuotes(JSON.parse(saved));

    // Staggered fade in animations
    setTimeout(() => setIsLoaded(true), 100);
  }, [mood]);

  const currentQuote = filteredQuotes[currentQuoteIndex];

  const handleNextQuote = () => {
    if (filteredQuotes.length === 0) return;
    
    setIsCardAnimating(true);
    
    setTimeout(() => {
      const nextIndex = (currentQuoteIndex + 1) % filteredQuotes.length;
      setCurrentQuoteIndex(nextIndex);
      setIsCardAnimating(false);
    }, 300);
  };

  const handleSaveQuote = () => {
    if (!currentQuote) return;
    
    setIsSaveAnimating(true);
    setTimeout(() => setIsSaveAnimating(false), 400);
    
    const newSaved = savedQuotes.includes(currentQuote.id)
      ? savedQuotes.filter(id => id !== currentQuote.id)
      : [...savedQuotes, currentQuote.id];
    
    setSavedQuotes(newSaved);
    localStorage.setItem("savedQuotes", JSON.stringify(newSaved));
  };

  const handleShare = async () => {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Quote copied!",
        description: "The quote has been copied to your clipboard.",
      });
    }
  };

  const handleBack = () => {
    navigate("/mood-selection");
  };

  const isSaved = currentQuote ? savedQuotes.includes(currentQuote.id) : false;

  if (!currentQuote) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col relative"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Top Section: Mood Badge & Back Button */}
      <div
        className={cn(
          "flex items-center justify-between px-6 pt-6 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        {/* Mood Badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-[18px]"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "1.5px solid #2C3E50",
          }}
        >
          <span className="text-base">{moodEmojis[mood]}</span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
          >
            {moodLabels[mood]}
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Go back"
        >
          <X size={24} />
        </button>
      </div>

      {/* Center Section: Quote Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div
          className={cn(
            "w-full max-w-[380px] min-h-[420px] rounded-3xl flex flex-col transition-all duration-400",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
            isCardAnimating && "opacity-0 scale-95"
          )}
          style={{
            backgroundColor: "white",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
            padding: "48px 36px",
            transitionDelay: isLoaded && !isCardAnimating ? "200ms" : "0ms",
          }}
        >
          {/* Quote text */}
          <blockquote
            className="text-[26px] md:text-[28px] font-medium leading-[1.5] tracking-[-0.3px] text-left mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
            }}
          >
            "{currentQuote.text}"
          </blockquote>

          {/* Author - pushed to bottom with mt-auto */}
          <p
            className="text-[15px] font-normal italic mt-auto"
            style={{ color: "rgba(44, 62, 80, 0.7)" }}
          >
            — {currentQuote.author}
          </p>

          {/* Card action buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handleSaveQuote}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95",
                isSaveAnimating && "animate-pulse"
              )}
              style={{
                backgroundColor: "white",
                border: "1.5px solid rgba(44, 62, 80, 0.2)",
                transform: isSaveAnimating ? "scale(1.3)" : undefined,
              }}
              aria-label={isSaved ? "Unsave quote" : "Save quote"}
            >
              <Heart
                size={22}
                style={{ color: isSaved ? "#E63946" : "#2C3E50" }}
                fill={isSaved ? "#E63946" : "none"}
              />
            </button>

            <button
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "white",
                border: "1.5px solid rgba(44, 62, 80, 0.2)",
              }}
              aria-label="Share quote"
            >
              <Share2 size={22} style={{ color: "#2C3E50" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Next Quote Button */}
      <div
        className={cn(
          "pb-8 px-8 flex justify-center transition-all duration-400",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: isLoaded ? "400ms" : "0ms" }}
      >
        <button
          onClick={handleNextQuote}
          className="w-full max-w-[340px] h-14 rounded-[28px] text-base font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "#2C3E50",
            color: "white",
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.25)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Next Quote
          <ArrowRight size={20} />
        </button>
      </div>
    </main>
  );
};

export default Quotes;
