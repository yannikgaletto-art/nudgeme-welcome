import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Share2, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";
type VoiceType = "stoic" | "mindful" | "modern";
type FilterType = "all" | VoiceType;
interface Quote {
  id: string;
  text: string;
  author: string;
  voice: VoiceType;
  primaryMood: MoodType;
  intentTags: string[];
  gradient: number;
}
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
}, {
  id: "2",
  text: "Almost everything will work again if you unplug it for a few minutes, including you.",
  author: "Anne Lamott",
  voice: "modern",
  primaryMood: "overwhelmed",
  intentTags: ["rest", "perspective", "clarity"],
  gradient: 4
}, {
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
}, {
  id: "5",
  text: "We suffer more often in imagination than in reality.",
  author: "Seneca",
  voice: "stoic",
  primaryMood: "anxious",
  intentTags: ["calm", "perspective", "reality"],
  gradient: 6
}, {
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
}, {
  id: "8",
  text: "Sometimes the bad things that happen in our lives put us directly on the path to the best things that will ever happen to us.",
  author: "Nicole Reed",
  voice: "modern",
  primaryMood: "sad",
  intentTags: ["hope", "perspective", "growth"],
  gradient: 4
}, {
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
}, {
  id: "11",
  text: "It's not what happens to you, but how you react to it that matters.",
  author: "Epictetus",
  voice: "stoic",
  primaryMood: "nervous",
  intentTags: ["control", "reassurance", "strength"],
  gradient: 2
}, {
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
}, {
  id: "14",
  text: "Be where you are; otherwise you will miss your life.",
  author: "Buddha",
  voice: "mindful",
  primaryMood: "neutral",
  intentTags: ["present", "wisdom", "mindfulness"],
  gradient: 3
}, {
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
}, {
  id: "17",
  text: "When you realize there is nothing lacking, the whole world belongs to you.",
  author: "Lao Tzu",
  voice: "mindful",
  primaryMood: "calm",
  intentTags: ["contentment", "peace", "gratitude"],
  gradient: 3
}, {
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
}, {
  id: "20",
  text: "Luck is what happens when preparation meets opportunity.",
  author: "Seneca",
  voice: "stoic",
  primaryMood: "energized",
  intentTags: ["action", "preparation", "momentum"],
  gradient: 4
}, {
  id: "21",
  text: "The journey of a thousand miles begins with one step.",
  author: "Lao Tzu",
  voice: "mindful",
  primaryMood: "energized",
  intentTags: ["action", "beginning", "momentum"],
  gradient: 5
}];
const filters: {
  label: string;
  value: FilterType;
}[] = [{
  label: "All",
  value: "all"
}, {
  label: "Stoic",
  value: "stoic"
}, {
  label: "Mindful",
  value: "mindful"
}, {
  label: "Modern",
  value: "modern"
}];
const Quotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood as MoodType || "calm";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);

  // Sort quotes with mood-matched ones first
  const getSortedQuotes = (voiceFilter: FilterType = "all") => {
    let filtered = voiceFilter === "all" ? [...quotes] : quotes.filter(q => q.voice === voiceFilter);

    // Sort: primary mood matches first
    return filtered.sort((a, b) => {
      const aMatch = a.primaryMood === mood ? 0 : 1;
      const bMatch = b.primaryMood === mood ? 0 : 1;
      return aMatch - bMatch;
    });
  };
  useEffect(() => {
    // Fade in on mount
    setTimeout(() => setIsLoaded(true), 100);
    // Load saved quotes from localStorage
    const saved = localStorage.getItem("savedQuotes");
    if (saved) setSavedQuotes(JSON.parse(saved));
    // Set initial quote based on mood
    const sorted = getSortedQuotes();
    if (sorted.length > 0) {
      setCurrentQuote(sorted[0]);
    }
  }, [mood]);
  const getFilteredQuotes = () => {
    if (showSaved) {
      return quotes.filter(q => savedQuotes.includes(q.id));
    }
    return getSortedQuotes(activeFilter);
  };
  const handleNextQuote = () => {
    const filtered = getFilteredQuotes();
    if (filtered.length === 0 || !currentQuote) return;
    setIsCardAnimating(true);
    setTimeout(() => {
      const currentIndex = filtered.findIndex(q => q.id === currentQuote.id);
      const nextIndex = (currentIndex + 1) % filtered.length;
      setCurrentQuote(filtered[nextIndex]);
      setIsCardAnimating(false);
    }, 200);
  };
  const handleSaveQuote = () => {
    if (!currentQuote) return;
    const newSaved = savedQuotes.includes(currentQuote.id) ? savedQuotes.filter(id => id !== currentQuote.id) : [...savedQuotes, currentQuote.id];
    setSavedQuotes(newSaved);
    localStorage.setItem("savedQuotes", JSON.stringify(newSaved));
  };
  const handleShare = async () => {
    if (!currentQuote) return;
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      await navigator.share({
        text: shareText
      });
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setShowSaved(false);
    const sorted = getSortedQuotes(filter);
    if (sorted.length > 0) {
      setCurrentQuote(sorted[0]);
    }
  };
  const handleShowSaved = () => {
    setShowSaved(true);
    const saved = quotes.filter(q => savedQuotes.includes(q.id));
    if (saved.length > 0) {
      setCurrentQuote(saved[0]);
    }
  };
  const isSaved = currentQuote ? savedQuotes.includes(currentQuote.id) : false;
  if (!currentQuote) return null;
  return <main className={cn("min-h-screen w-full flex flex-col transition-all duration-500", isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]")} style={{
    backgroundColor: "#F5E6D3"
  }}>
      {/* Top Section: Filters */}
      <div className="pt-5 px-6">
        {/* Back button */}
        <button onClick={() => navigate("/breathing", {
        state: {
          mood
        }
      })} className="mb-4 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70" style={{
        color: "#2C3E50"
      }}>
          <ArrowLeft size={18} />
          Back
        </button>

        
      </div>

      {/* Center Section: Quote Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className={cn("w-full max-w-[380px] min-h-[400px] max-h-[600px] rounded-3xl flex flex-col transition-all duration-200", isCardAnimating && "opacity-0 scale-95")} style={{
        backgroundColor: "white",
        boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
        padding: "40px 32px"
      }}>
          {/* Quote category badge */}
          <span className="text-[11px] font-semibold uppercase tracking-[1px] mb-6" style={{
          color: "rgba(44, 62, 80, 0.6)"
        }}>
            {currentQuote.voice}
          </span>

          {/* Quote text */}
          <blockquote className="text-[24px] md:text-[26px] font-medium leading-[1.5] mb-7" style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2C3E50"
        }}>
            "{currentQuote.text}"
          </blockquote>

          {/* Author - pushed to bottom with mt-auto */}
          <p className="text-[15px] font-normal mt-auto" style={{
          color: "rgba(44, 62, 80, 0.7)"
        }}>
            — {currentQuote.author}
          </p>

          {/* Card action icons */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handleSaveQuote} className="p-3 rounded-full transition-all duration-200 hover:scale-110" style={{
            backgroundColor: isSaved ? "rgba(239, 68, 68, 0.1)" : "rgba(44, 62, 80, 0.06)"
          }} aria-label={isSaved ? "Unsave quote" : "Save quote"}>
              <Heart size={22} style={{
              color: isSaved ? "#EF4444" : "#2C3E50"
            }} fill={isSaved ? "#EF4444" : "none"} />
            </button>

            <button onClick={handleShare} className="p-3 rounded-full transition-all duration-200 hover:scale-110" style={{
            backgroundColor: "rgba(44, 62, 80, 0.06)"
          }} aria-label="Share quote">
              <Share2 size={22} style={{
              color: "#2C3E50"
            }} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Next Quote Button */}
      <div className="pb-10 px-6 flex justify-center">
        <button onClick={handleNextQuote} className="h-14 px-8 rounded-[28px] text-base font-medium flex items-center gap-3 transition-all duration-200 hover:scale-[1.02]" style={{
        backgroundColor: "#2C3E50",
        color: "white",
        boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)"
      }}>
          <RefreshCw size={20} />
          Next Quote
        </button>
      </div>
    </main>;
};
export default Quotes;