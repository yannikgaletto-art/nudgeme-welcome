import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Share2, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";
type FilterType = "all" | "stoic" | "mindful" | "modern";

interface Quote {
  id: string;
  text: string;
  author: string;
  category: FilterType;
}

const quotes: Quote[] = [
  { id: "1", text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", category: "stoic" },
  { id: "2", text: "He who fears death will never do anything worthy of a living man.", author: "Seneca", category: "stoic" },
  { id: "3", text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", category: "stoic" },
  { id: "4", text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", category: "mindful" },
  { id: "5", text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh", category: "mindful" },
  { id: "6", text: "Be where you are, not where you think you should be.", author: "Unknown", category: "mindful" },
  { id: "7", text: "You are not your thoughts. You are the observer of your thoughts.", author: "Eckhart Tolle", category: "modern" },
  { id: "8", text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", category: "modern" },
  { id: "9", text: "Self-care is not selfish. You cannot serve from an empty vessel.", author: "Eleanor Brown", category: "modern" },
  { id: "10", text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca", category: "stoic" },
  { id: "11", text: "Smile, breathe, and go slowly.", author: "Thich Nhat Hanh", category: "mindful" },
  { id: "12", text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman", category: "modern" },
];

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Stoic", value: "stoic" },
  { label: "Mindful", value: "mindful" },
  { label: "Modern", value: "modern" },
];

const Quotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as MoodType) || "calm";

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);

  useEffect(() => {
    // Fade in on mount
    setTimeout(() => setIsLoaded(true), 100);
    // Load saved quotes from localStorage
    const saved = localStorage.getItem("savedQuotes");
    if (saved) setSavedQuotes(JSON.parse(saved));
  }, []);

  const getFilteredQuotes = () => {
    if (showSaved) {
      return quotes.filter((q) => savedQuotes.includes(q.id));
    }
    if (activeFilter === "all") return quotes;
    return quotes.filter((q) => q.category === activeFilter);
  };

  const handleNextQuote = () => {
    const filtered = getFilteredQuotes();
    if (filtered.length === 0) return;
    
    setIsCardAnimating(true);
    setTimeout(() => {
      const currentIndex = filtered.findIndex((q) => q.id === currentQuote.id);
      const nextIndex = (currentIndex + 1) % filtered.length;
      setCurrentQuote(filtered[nextIndex]);
      setIsCardAnimating(false);
    }, 200);
  };

  const handleSaveQuote = () => {
    const newSaved = savedQuotes.includes(currentQuote.id)
      ? savedQuotes.filter((id) => id !== currentQuote.id)
      : [...savedQuotes, currentQuote.id];
    
    setSavedQuotes(newSaved);
    localStorage.setItem("savedQuotes", JSON.stringify(newSaved));
  };

  const handleShare = async () => {
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setShowSaved(false);
    const filtered = filter === "all" ? quotes : quotes.filter((q) => q.category === filter);
    if (filtered.length > 0) {
      setCurrentQuote(filtered[0]);
    }
  };

  const handleShowSaved = () => {
    setShowSaved(true);
    const saved = quotes.filter((q) => savedQuotes.includes(q.id));
    if (saved.length > 0) {
      setCurrentQuote(saved[0]);
    }
  };

  const isSaved = savedQuotes.includes(currentQuote.id);

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col transition-all duration-500",
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
      )}
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Top Section: Filters */}
      <div className="pt-5 px-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/breathing", { state: { mood } })}
          className="mb-4 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#2C3E50" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-center justify-between">
          {/* Filter chips */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={cn(
                  "h-[38px] px-5 rounded-[19px] text-sm font-medium whitespace-nowrap transition-all duration-200",
                  activeFilter === filter.value && !showSaved
                    ? "text-white shadow-md scale-105"
                    : "hover:scale-[1.03]"
                )}
                style={{
                  backgroundColor:
                    activeFilter === filter.value && !showSaved
                      ? "#2C3E50"
                      : "rgba(255, 255, 255, 0.6)",
                  border:
                    activeFilter === filter.value && !showSaved
                      ? "1.5px solid #2C3E50"
                      : "1.5px solid rgba(44, 62, 80, 0.3)",
                  color: activeFilter === filter.value && !showSaved ? "white" : "#2C3E50",
                  boxShadow:
                    activeFilter === filter.value && !showSaved
                      ? "0 2px 8px rgba(44, 62, 80, 0.2)"
                      : "none",
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Saved tab */}
          <button
            onClick={handleShowSaved}
            className={cn(
              "h-[38px] px-4 rounded-[19px] text-sm font-medium flex items-center gap-2 transition-all duration-200 ml-3 shrink-0",
              showSaved ? "scale-105" : "hover:scale-[1.03]"
            )}
            style={{
              backgroundColor: showSaved ? "#2C3E50" : "rgba(255, 255, 255, 0.6)",
              color: showSaved ? "white" : "#2C3E50",
              boxShadow: showSaved ? "0 2px 8px rgba(44, 62, 80, 0.2)" : "none",
            }}
          >
            <Heart size={16} fill={showSaved ? "white" : "none"} />
            Saved
          </button>
        </div>
      </div>

      {/* Center Section: Quote Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div
          className={cn(
            "w-full max-w-[420px] rounded-3xl p-8 flex flex-col justify-center transition-all duration-200",
            isCardAnimating && "opacity-0 scale-95"
          )}
          style={{
            aspectRatio: "4/5",
            backgroundColor: "white",
            boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
          }}
        >
          {/* Quote category badge */}
          <div
            className="self-start px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-6"
            style={{
              backgroundColor: "rgba(44, 62, 80, 0.08)",
              color: "#2C3E50",
            }}
          >
            {currentQuote.category}
          </div>

          {/* Quote text */}
          <blockquote
            className="text-[22px] md:text-[26px] font-medium leading-[1.4] tracking-[-0.3px]"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2C3E50",
            }}
          >
            "{currentQuote.text}"
          </blockquote>

          {/* Author */}
          <p
            className="mt-6 text-base font-medium"
            style={{ color: "#6B6B6B" }}
          >
            — {currentQuote.author}
          </p>

          {/* Card action icons */}
          <div className="flex items-center gap-4 mt-auto pt-8">
            <button
              onClick={handleSaveQuote}
              className="p-3 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: isSaved ? "rgba(239, 68, 68, 0.1)" : "rgba(44, 62, 80, 0.06)",
              }}
              aria-label={isSaved ? "Unsave quote" : "Save quote"}
            >
              <Heart
                size={22}
                style={{ color: isSaved ? "#EF4444" : "#2C3E50" }}
                fill={isSaved ? "#EF4444" : "none"}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: "rgba(44, 62, 80, 0.06)" }}
              aria-label="Share quote"
            >
              <Share2 size={22} style={{ color: "#2C3E50" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Next Quote Button */}
      <div className="pb-10 px-6 flex justify-center">
        <button
          onClick={handleNextQuote}
          className="h-14 px-8 rounded-[28px] text-base font-medium flex items-center gap-3 transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: "#2C3E50",
            color: "white",
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          }}
        >
          <RefreshCw size={20} />
          Next Quote
        </button>
      </div>
    </main>
  );
};

export default Quotes;