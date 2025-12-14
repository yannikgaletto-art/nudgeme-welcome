import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Share2, ArrowLeft, Check, Loader2, Settings, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import PremiumModal from "@/components/PremiumModal";
import PremiumBadge from "@/components/PremiumBadge";
import { isSaveLimitReached, getFreeSaveLimit, trackPremiumPrompt, trackMaybeLater, shouldShowPremiumPrompt, isPremiumBannerDismissed, dismissPremiumBanner } from "@/lib/premium";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";
type CategoryType = "spirituality" | "politics" | "philosophy" | "sociology" | "sports" | "literature" | "science" | "business";
type TabType = "forYou" | "explore";

interface Quote {
  id: string;
  text: string;
  author: string;
  voice: "stoic" | "mindful" | "modern";
  primaryMood: MoodType;
  intentTags: string[];
  gradient: number;
}

interface CategoryQuote {
  id: string;
  text: string;
  author: string;
  category: CategoryType;
}

interface SavedQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  savedAt: number;
}

const STORAGE_KEY = "nudgeme_saved_quotes";

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

const categoryEmojis: Record<CategoryType, string> = {
  spirituality: "🕉️",
  politics: "🏛️",
  philosophy: "🤔",
  sociology: "👥",
  sports: "⚽",
  literature: "📚",
  science: "🔬",
  business: "💼",
};

const categoryLabels: Record<CategoryType, string> = {
  spirituality: "Spirituality",
  politics: "Politics",
  philosophy: "Philosophy",
  sociology: "Sociology",
  sports: "Sports",
  literature: "Literature",
  science: "Science",
  business: "Business",
};

// Removed categoryGradients - now using white cards with navy borders

const quotes: Quote[] = [
  // OVERWHELMED quotes
  { id: "1", text: "You have power over your mind—not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", voice: "stoic", primaryMood: "overwhelmed", intentTags: ["control", "strength", "perspective"], gradient: 2 },
  { id: "2", text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", voice: "modern", primaryMood: "overwhelmed", intentTags: ["rest", "perspective", "clarity"], gradient: 4 },
  { id: "3", text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön", voice: "mindful", primaryMood: "overwhelmed", intentTags: ["perspective", "peace", "acceptance"], gradient: 3 },
  // ANXIOUS quotes
  { id: "4", text: "Breathing in, I calm body and mind. Breathing out, I smile.", author: "Thich Nhat Hanh", voice: "mindful", primaryMood: "anxious", intentTags: ["calm", "breathing", "present"], gradient: 3 },
  { id: "5", text: "We suffer more often in imagination than in reality.", author: "Seneca", voice: "stoic", primaryMood: "anxious", intentTags: ["calm", "perspective", "reality"], gradient: 6 },
  { id: "6", text: "Nothing diminishes anxiety faster than action.", author: "Walter Anderson", voice: "modern", primaryMood: "anxious", intentTags: ["action", "calm", "momentum"], gradient: 7 },
  // SAD quotes
  { id: "7", text: "The wound is the place where the Light enters you.", author: "Rumi", voice: "mindful", primaryMood: "sad", intentTags: ["hope", "growth", "resilience"], gradient: 5 },
  { id: "8", text: "Sometimes the bad things that happen in our lives put us directly on the path to the best things that will ever happen to us.", author: "Nicole Reed", voice: "modern", primaryMood: "sad", intentTags: ["hope", "perspective", "growth"], gradient: 4 },
  { id: "9", text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius", voice: "stoic", primaryMood: "sad", intentTags: ["strength", "perspective", "dignity"], gradient: 1 },
  // NERVOUS quotes
  { id: "10", text: "The courage to be vulnerable is not about winning or losing, it's about showing up.", author: "Brené Brown", voice: "modern", primaryMood: "nervous", intentTags: ["courage", "confidence", "acceptance"], gradient: 5 },
  { id: "11", text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", voice: "stoic", primaryMood: "nervous", intentTags: ["control", "reassurance", "strength"], gradient: 2 },
  { id: "12", text: "The present moment is the only time over which we have dominion.", author: "Thich Nhat Hanh", voice: "mindful", primaryMood: "nervous", intentTags: ["present", "control", "calm"], gradient: 3 },
  // NEUTRAL quotes
  { id: "13", text: "The quieter you become, the more you can hear.", author: "Ram Dass", voice: "mindful", primaryMood: "neutral", intentTags: ["wisdom", "reflection", "peace"], gradient: 6 },
  { id: "14", text: "Be where you are; otherwise you will miss your life.", author: "Buddha", voice: "mindful", primaryMood: "neutral", intentTags: ["present", "wisdom", "mindfulness"], gradient: 3 },
  { id: "15", text: "The cost of a thing is the amount of life you exchange for it.", author: "Henry David Thoreau", voice: "modern", primaryMood: "neutral", intentTags: ["wisdom", "perspective", "values"], gradient: 1 },
  // CALM quotes
  { id: "16", text: "A calm mind, a fit body, and a house full of love. These things cannot be bought—they must be earned.", author: "Naval Ravikant", voice: "modern", primaryMood: "calm", intentTags: ["gratitude", "contentment", "values"], gradient: 7 },
  { id: "17", text: "When you realize there is nothing lacking, the whole world belongs to you.", author: "Lao Tzu", voice: "mindful", primaryMood: "calm", intentTags: ["contentment", "peace", "gratitude"], gradient: 3 },
  { id: "18", text: "He who is not satisfied with a little, is satisfied with nothing.", author: "Epicurus", voice: "stoic", primaryMood: "calm", intentTags: ["contentment", "gratitude", "wisdom"], gradient: 6 },
  // ENERGIZED quotes
  { id: "19", text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", voice: "modern", primaryMood: "energized", intentTags: ["action", "systems", "achievement"], gradient: 7 },
  { id: "20", text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", voice: "stoic", primaryMood: "energized", intentTags: ["action", "preparation", "momentum"], gradient: 4 },
  { id: "21", text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", voice: "mindful", primaryMood: "energized", intentTags: ["action", "beginning", "momentum"], gradient: 5 }
];

const categoryQuotes: CategoryQuote[] = [
  // SPIRITUALITY
  { id: "c1", text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", category: "spirituality" },
  { id: "c2", text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh", category: "spirituality" },
  { id: "c3", text: "Whatever the present moment contains, accept it as if you had chosen it.", author: "Eckhart Tolle", category: "spirituality" },
  { id: "c4", text: "The only thing you know for sure is: 'here and now I am'.", author: "Sri Nisargadatta Maharaj", category: "spirituality" },
  { id: "c5", text: "The wound is the place where the Light enters you.", author: "Rumi", category: "spirituality" },
  // POLITICS
  { id: "c6", text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "politics" },
  { id: "c7", text: "We are the ones we've been waiting for.", author: "Barack Obama", category: "politics" },
  { id: "c8", text: "The best way to predict your future is to create it.", author: "Abraham Lincoln", category: "politics" },
  { id: "c9", text: "The time is always right to do what is right.", author: "Martin Luther King Jr.", category: "politics" },
  { id: "c10", text: "Efforts and courage are not enough without purpose and direction.", author: "John F. Kennedy", category: "politics" },
  // PHILOSOPHY
  { id: "c11", text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche", category: "philosophy" },
  { id: "c12", text: "Quality is not an act, it is a habit.", author: "Aristotle", category: "philosophy" },
  { id: "c13", text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "philosophy" },
  { id: "c14", text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "philosophy" },
  { id: "c15", text: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.", author: "Socrates", category: "philosophy" },
  // SOCIOLOGY
  { id: "c16", text: "Resonance is not an echo, but a responsive relationship to the world.", author: "Hartmut Rosa", category: "sociology" },
  { id: "c17", text: "Never doubt that a small group of thoughtful, committed citizens can change the world; indeed, it's the only thing that ever has.", author: "Margaret Mead", category: "sociology" },
  { id: "c18", text: "The habitus is a system of durable, transposable dispositions.", author: "Pierre Bourdieu", category: "sociology" },
  { id: "c19", text: "Neither the life of an individual nor the history of a society can be understood without understanding both.", author: "C. Wright Mills", category: "sociology" },
  { id: "c20", text: "In a liquid modern life, there are no permanent bonds, and any that we take up for a time must be tied loosely.", author: "Zygmunt Bauman", category: "sociology" },
  // SPORTS
  { id: "c21", text: "Don't count the days, make the days count.", author: "Muhammad Ali", category: "sports" },
  { id: "c22", text: "I've failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan", category: "sports" },
  { id: "c23", text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi", category: "sports" },
  { id: "c24", text: "A champion is defined not by their wins but by how they can recover when they fall.", author: "Serena Williams", category: "sports" },
  { id: "c25", text: "Everything negative – pressure, challenges – is all an opportunity for me to rise.", author: "Kobe Bryant", category: "sports" },
  // LITERATURE
  { id: "c26", text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou", category: "literature" },
  { id: "c27", text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "literature" },
  { id: "c28", text: "No need to hurry. No need to sparkle. No need to be anybody but oneself.", author: "Virginia Woolf", category: "literature" },
  { id: "c29", text: "Paths are made by walking.", author: "Franz Kafka", category: "literature" },
  { id: "c30", text: "In a time of deceit telling the truth is a revolutionary act.", author: "George Orwell", category: "literature" },
  // SCIENCE
  { id: "c31", text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "science" },
  { id: "c32", text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", category: "science" },
  { id: "c33", text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "science" },
  { id: "c34", text: "The first principle is that you must not fool yourself and you are the easiest person to fool.", author: "Richard Feynman", category: "science" },
  { id: "c35", text: "If I have seen further, it is by standing on the shoulders of giants.", author: "Isaac Newton", category: "science" },
  // BUSINESS
  { id: "c36", text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "business" },
  { id: "c37", text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "business" },
  { id: "c38", text: "People don't buy what you do; they buy why you do it.", author: "Simon Sinek", category: "business" },
  { id: "c39", text: "Failure is not the opposite of success; it's part of success.", author: "Arianna Huffington", category: "business" },
  { id: "c40", text: "Coming together is a beginning, staying together is progress, and working together is success.", author: "Henry Ford", category: "business" },
];

const categories: CategoryType[] = ["spirituality", "politics", "philosophy", "sociology", "sports", "literature", "science", "business"];

const Quotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as MoodType) || "calm";

  const [activeTab, setActiveTab] = useState<TabType>("forYou");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryQuoteIndex, setCategoryQuoteIndex] = useState(0);
  
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalType, setPremiumModalType] = useState<"save" | "export" | "category">("save");
  const [showPremiumBanner, setShowPremiumBanner] = useState(!isPremiumBannerDismissed());

  useEffect(() => {
    const moodQuotes = quotes.filter(q => q.primaryMood === mood);
    setFilteredQuotes(moodQuotes);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedQuotes(JSON.parse(saved) as SavedQuote[]);
    setTimeout(() => setIsLoaded(true), 100);
  }, [mood]);

  const currentQuote = filteredQuotes[currentQuoteIndex];
  const isLastQuote = currentQuoteIndex === filteredQuotes.length - 1;

  const filteredCategoryQuotes = selectedCategory 
    ? categoryQuotes.filter(q => q.category === selectedCategory)
    : [];
  const currentCategoryQuote = filteredCategoryQuotes[categoryQuoteIndex];
  const isLastCategoryQuote = categoryQuoteIndex === filteredCategoryQuotes.length - 1;

  const handleTabSwitch = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabSwitching(true);
    setTimeout(() => {
      setActiveTab(tab);
      setSelectedCategory(null);
      setCategoryQuoteIndex(0);
      setIsTabSwitching(false);
    }, 150);
  };

  const handleNextQuote = () => {
    if (filteredQuotes.length === 0) return;
    if (isLastQuote) {
      navigate("/mood");
      return;
    }
    setIsCardAnimating(true);
    setTimeout(() => {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
      setIsCardAnimating(false);
    }, 300);
  };

  const handleNextCategoryQuote = () => {
    if (filteredCategoryQuotes.length === 0) return;
    if (isLastCategoryQuote) {
      setIsCardAnimating(true);
      setTimeout(() => {
        setSelectedCategory(null);
        setCategoryQuoteIndex(0);
        setIsCardAnimating(false);
      }, 300);
      return;
    }
    setIsCardAnimating(true);
    setTimeout(() => {
      setCategoryQuoteIndex(categoryQuoteIndex + 1);
      setIsCardAnimating(false);
    }, 300);
  };

  const handleCategorySelect = (category: CategoryType) => {
    setIsCardAnimating(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setCategoryQuoteIndex(0);
      setIsCardAnimating(false);
    }, 200);
  };

  const handleSaveQuote = () => {
    const quote = activeTab === "forYou" ? currentQuote : currentCategoryQuote;
    if (!quote) return;
    
    const isAlreadySaved = savedQuotes.some(q => q.id === quote.id);
    
    // Check save limit for new saves
    if (!isAlreadySaved && isSaveLimitReached(savedQuotes.length)) {
      if (shouldShowPremiumPrompt()) {
        setPremiumModalType("save");
        setShowPremiumModal(true);
        trackPremiumPrompt();
      } else {
        toast({ 
          title: "Save limit reached", 
          description: `Free users can save up to ${getFreeSaveLimit()} quotes.`, 
          duration: 2500 
        });
      }
      return;
    }
    
    setIsSaveAnimating(true);
    setTimeout(() => setIsSaveAnimating(false), 400);
    
    if (isAlreadySaved) {
      const newSaved = savedQuotes.filter(q => q.id !== quote.id);
      setSavedQuotes(newSaved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      toast({ title: "Removed", duration: 1500 });
    } else {
      const source = activeTab === "forYou" 
        ? `${moodEmojis[mood]} ${moodLabels[mood]}`
        : categoryLabels[(quote as CategoryQuote).category];
      const newQuote: SavedQuote = {
        id: quote.id,
        text: quote.text,
        author: quote.author,
        source,
        savedAt: Date.now(),
      };
      const newSaved = [...savedQuotes, newQuote];
      setSavedQuotes(newSaved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      toast({ title: "Saved!", duration: 1500 });
    }
  };

  const handleExportImage = () => {
    if (shouldShowPremiumPrompt()) {
      setPremiumModalType("export");
      setShowPremiumModal(true);
      trackPremiumPrompt();
    } else {
      toast({ title: "Export as Image", description: "Premium feature coming soon!", duration: 2000 });
    }
  };

  const handleCreateCategory = () => {
    if (shouldShowPremiumPrompt()) {
      setPremiumModalType("category");
      setShowPremiumModal(true);
      trackPremiumPrompt();
    } else {
      toast({ title: "Custom Categories", description: "Premium feature coming soon!", duration: 2000 });
    }
  };

  const handlePremiumModalClose = () => {
    setShowPremiumModal(false);
    trackMaybeLater();
  };

  const handleDismissBanner = () => {
    setShowPremiumBanner(false);
    dismissPremiumBanner();
  };

  const getPremiumModalContent = () => {
    switch (premiumModalType) {
      case "save":
        return {
          icon: "❤️✨",
          title: "Save Unlimited Quotes",
          description: `Free users can save up to ${getFreeSaveLimit()} quotes. Upgrade to save unlimited favorites and access them anytime.`,
          benefits: ["Unlimited saved quotes", "Sync across devices", "Never lose your favorites"],
        };
      case "export":
        return {
          icon: "📸✨",
          title: "Beautiful Quote Images",
          description: "Create stunning visual quotes to share on social media. Premium members can export any quote as a custom image.",
          benefits: ["Custom backgrounds", "Multiple layouts", "High-resolution export"],
        };
      case "category":
        return {
          icon: "🗂️✨",
          title: "Custom Categories",
          description: "Organize quotes your way. Create personal categories and curate your own collections.",
          benefits: ["Create unlimited categories", "Organize your favorites", "Personal curation"],
        };
    }
  };

  const handleShare = async () => {
    const quote = activeTab === "forYou" ? currentQuote : currentCategoryQuote;
    if (!quote || isSharing) return;
    
    setIsSharing(true);
    
    // Truncate long quotes for compatibility (280 char limit)
    const truncatedText = quote.text.length > 200 
      ? quote.text.slice(0, 197) + "..." 
      : quote.text;
    const formattedText = `"${truncatedText}"\n\n— ${quote.author}\n\nShared from NudgeMe`;
    
    const canCopy = typeof navigator.clipboard?.writeText === "function";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const canShare = typeof navigator.share === "function" && isMobile;
    
    let success = false;
    
    try {
      // Method 1: Try clipboard first (most compatible)
      if (canCopy) {
        await navigator.clipboard.writeText(formattedText);
        console.log("Share:", { quote: truncatedText, author: quote.author, method: "clipboard", source: activeTab });
        toast({
          title: "Quote copied to clipboard!",
          duration: 2000,
        });
        success = true;
      }
      // Method 2: Try Web Share API on mobile only
      else if (canShare) {
        await navigator.share({
          title: "NudgeMe Quote",
          text: formattedText,
        });
        console.log("Share:", { quote: truncatedText, author: quote.author, method: "native", source: activeTab });
        success = true;
      }
      // Method 3: Fallback - show manual copy toast
      else {
        toast({
          title: "Copy manually:",
          description: formattedText.slice(0, 100) + "...",
          duration: 5000,
        });
      }
      
      if (success) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 500);
      }
    } catch (err: unknown) {
      const error = err as Error;
      // Silent on user cancel
      if (error.name === "AbortError") {
        // User canceled share - do nothing
      } else if (error.name === "NotAllowedError") {
        toast({
          title: "Please allow clipboard access",
          variant: "destructive",
          duration: 2000,
        });
      } else {
        // Try Web Share as fallback if clipboard failed
        if (canShare) {
          try {
            await navigator.share({ title: "NudgeMe Quote", text: formattedText });
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 500);
          } catch {
            toast({
              title: "Sharing failed. Try again.",
              variant: "destructive",
              duration: 2000,
            });
          }
        } else {
          toast({
            title: "Sharing failed. Try again.",
            variant: "destructive",
            duration: 2000,
          });
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    if (activeTab === "explore" && selectedCategory) {
      setIsCardAnimating(true);
      setTimeout(() => {
        setSelectedCategory(null);
        setCategoryQuoteIndex(0);
        setIsCardAnimating(false);
      }, 200);
    } else {
      navigate("/mood");
    }
  };

  const isSaved = activeTab === "forYou" 
    ? (currentQuote ? savedQuotes.some(q => q.id === currentQuote.id) : false)
    : (currentCategoryQuote ? savedQuotes.some(q => q.id === currentCategoryQuote.id) : false);

  if (activeTab === "forYou" && !currentQuote) return null;

  return (
    <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-6 pt-6 transition-all duration-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}>
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/saved")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[20px] transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              border: "1.5px solid rgba(44, 62, 80, 0.2)",
            }}
            aria-label={`View saved quotes (${savedQuotes.length})`}
          >
            <Heart size={16} style={{ color: savedQuotes.length > 0 ? "#E63946" : "#2C3E50" }} fill={savedQuotes.length > 0 ? "#E63946" : "none"} />
            <span className="text-sm font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              {savedQuotes.length}
            </span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ color: "rgba(44, 62, 80, 0.6)" }}
            aria-label="Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={cn(
        "flex justify-center px-6 mt-4 transition-all duration-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )} style={{ transitionDelay: "100ms" }}>
        <div
          className="w-full max-w-[380px] h-12 rounded-3xl flex p-1"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
        >
          <button
            onClick={() => handleTabSwitch("forYou")}
            className={cn(
              "flex-1 h-10 rounded-[20px] font-semibold text-sm transition-all duration-200",
              activeTab === "forYou" ? "text-white" : ""
            )}
            style={{
              fontFamily: "Inter, sans-serif",
              backgroundColor: activeTab === "forYou" ? "#2C3E50" : "transparent",
              color: activeTab === "forYou" ? "white" : "rgba(44, 62, 80, 0.6)",
              boxShadow: activeTab === "forYou" ? "0 2px 8px rgba(44, 62, 80, 0.15)" : "none",
            }}
          >
            For You
          </button>
          <button
            onClick={() => handleTabSwitch("explore")}
            className={cn(
              "flex-1 h-10 rounded-[20px] font-semibold text-sm transition-all duration-200",
              activeTab === "explore" ? "text-white" : ""
            )}
            style={{
              fontFamily: "Inter, sans-serif",
              backgroundColor: activeTab === "explore" ? "#2C3E50" : "transparent",
              color: activeTab === "explore" ? "white" : "rgba(44, 62, 80, 0.6)",
              boxShadow: activeTab === "explore" ? "0 2px 8px rgba(44, 62, 80, 0.15)" : "none",
            }}
          >
            Explore
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 flex flex-col items-center px-6 py-6 transition-all duration-300",
        isTabSwitching ? "opacity-0" : "opacity-100"
      )}>
        {activeTab === "forYou" && currentQuote && (
          <>
            {/* Mood Label Bar - Clickable to return to mood selection */}
            <button
              onClick={() => navigate("/mood")}
              className={cn(
                "w-full max-w-[380px] h-[54px] rounded-3xl flex items-center justify-center mb-4 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.97]",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              )}
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)",
                padding: "0 24px",
                transitionDelay: "150ms",
              }}
              aria-label={`Current mood: ${moodLabels[mood]}. Tap to change mood.`}
            >
              <span className="text-xl font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
                {moodEmojis[mood]} {moodLabels[mood]}
              </span>
            </button>

            {/* Quote Card */}
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
                transitionDelay: !isCardAnimating ? "200ms" : "0ms",
              }}
            >
              <blockquote
                className="text-[26px] md:text-[28px] font-medium leading-[1.5] tracking-[-0.3px] text-left mb-8"
                style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
              >
                "{currentQuote.text}"
              </blockquote>
              <p className="text-[15px] font-normal italic mt-auto" style={{ color: "rgba(44, 62, 80, 0.7)" }}>
                — {currentQuote.author}
              </p>
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={handleSaveQuote}
                  className={cn("w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95", isSaveAnimating && "animate-pulse")}
                  style={{ backgroundColor: "white", border: "1.5px solid rgba(44, 62, 80, 0.2)", transform: isSaveAnimating ? "scale(1.3)" : undefined }}
                  aria-label={isSaved ? "Unsave quote" : "Save quote"}
                >
                  <Heart size={22} style={{ color: isSaved ? "#E63946" : "#2C3E50" }} fill={isSaved ? "#E63946" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200",
                    !isSharing && "hover:scale-105 active:scale-95",
                    isSharing && "opacity-60 cursor-not-allowed"
                  )}
                  style={{ 
                    backgroundColor: "white", 
                    border: "1.5px solid rgba(44, 62, 80, 0.2)",
                    transform: shareSuccess ? "scale(1.2)" : undefined,
                  }}
                  aria-label="Share this quote"
                >
                  {isSharing ? (
                    <Loader2 size={22} style={{ color: "#2C3E50" }} className="animate-spin" />
                  ) : shareSuccess ? (
                    <Check size={22} style={{ color: "#22c55e" }} />
                  ) : (
                    <Share2 size={22} style={{ color: "#2C3E50" }} />
                  )}
                </button>
                <button
                  onClick={handleExportImage}
                  className="w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95 relative"
                  style={{ 
                    backgroundColor: "white", 
                    border: "1.5px solid rgba(255, 215, 0, 0.4)",
                  }}
                  aria-label="Export as image (Premium)"
                >
                  <Camera size={22} style={{ color: "#FFD700" }} />
                  <div className="absolute -top-1 -right-1">
                    <PremiumBadge size="sm" showIcon={false} className="!px-1.5 !py-0.5 !text-[8px]" />
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "explore" && !selectedCategory && (
          <div className="w-full max-w-[420px] flex flex-col gap-4 mt-2">
            {/* Create Category Button */}
            <button
              onClick={handleCreateCategory}
              className={cn(
                "w-full h-12 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                backgroundColor: "rgba(255, 215, 0, 0.1)",
                border: "1.5px dashed rgba(255, 215, 0, 0.5)",
              }}
            >
              <span className="text-sm font-medium" style={{ color: "#B8860B", fontFamily: "Inter, sans-serif" }}>
                + Create Category
              </span>
              <PremiumBadge size="sm" />
            </button>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => {
                const count = categoryQuotes.filter(q => q.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={cn(
                      "aspect-square rounded-[20px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      backgroundColor: "white",
                      border: "2px solid rgba(44, 62, 80, 0.2)",
                      boxShadow: "0 4px 16px rgba(44, 62, 80, 0.1)",
                      padding: "28px",
                      transitionDelay: `${50 * index}ms`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(44, 62, 80, 0.4)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(44, 62, 80, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(44, 62, 80, 0.2)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(44, 62, 80, 0.1)";
                    }}
                  >
                    <span className="text-[44px]">{categoryEmojis[category]}</span>
                    <span className="font-semibold text-base mt-4" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
                      {categoryLabels[category]}
                    </span>
                    <span className="text-xs mt-1" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
                      ({count} quotes)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Premium Banner */}
            {showPremiumBanner && (
              <div
                className={cn(
                  "w-full rounded-2xl p-5 relative transition-all duration-300",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)",
                  border: "1.5px solid rgba(255, 215, 0, 0.3)",
                  transitionDelay: "400ms",
                }}
              >
                <button
                  onClick={handleDismissBanner}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
                  style={{ color: "rgba(44, 62, 80, 0.5)" }}
                  aria-label="Dismiss banner"
                >
                  ×
                </button>
                <h3 className="font-semibold text-base mb-1" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
                  Want More Quotes?
                </h3>
                <p className="text-sm mb-3" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
                  Premium members get 200+ additional quotes from exclusive categories
                </p>
                <button
                  onClick={() => navigate("/premium")}
                  className="h-10 px-5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#2C3E50",
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Unlock Premium
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "explore" && selectedCategory && currentCategoryQuote && (
          <>
            {/* Category Label Bar */}
            <div
              className={cn(
                "w-full max-w-[380px] h-[54px] rounded-3xl flex items-center justify-center mb-4 transition-all duration-300",
                !isCardAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              )}
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)",
                padding: "0 24px",
              }}
            >
              <span className="text-xl font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
                {categoryEmojis[selectedCategory]} {categoryLabels[selectedCategory]}
              </span>
            </div>

            {/* Quote Card */}
            <div
              className={cn(
                "w-full max-w-[380px] min-h-[420px] rounded-3xl flex flex-col transition-all duration-400",
                !isCardAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
              style={{
                backgroundColor: "white",
                boxShadow: "0 8px 32px rgba(44, 62, 80, 0.12)",
                padding: "48px 36px",
              }}
            >
              <blockquote
                className="text-[26px] md:text-[28px] font-medium leading-[1.5] tracking-[-0.3px] text-left mb-8"
                style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
              >
                "{currentCategoryQuote.text}"
              </blockquote>
              <p className="text-[15px] font-normal italic mt-auto" style={{ color: "rgba(44, 62, 80, 0.7)" }}>
                — {currentCategoryQuote.author}
              </p>
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleSaveQuote}
                  className={cn("w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95", isSaveAnimating && "animate-pulse")}
                  style={{ backgroundColor: "white", border: "1.5px solid rgba(44, 62, 80, 0.2)", transform: isSaveAnimating ? "scale(1.3)" : undefined }}
                  aria-label={isSaved ? "Unsave quote" : "Save quote"}
                >
                  <Heart size={22} style={{ color: isSaved ? "#E63946" : "#2C3E50" }} fill={isSaved ? "#E63946" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-3xl transition-all duration-200",
                    !isSharing && "hover:scale-105 active:scale-95",
                    isSharing && "opacity-60 cursor-not-allowed"
                  )}
                  style={{ 
                    backgroundColor: "white", 
                    border: "1.5px solid rgba(44, 62, 80, 0.2)",
                    transform: shareSuccess ? "scale(1.2)" : undefined,
                  }}
                  aria-label="Share this quote"
                >
                  {isSharing ? (
                    <Loader2 size={22} style={{ color: "#2C3E50" }} className="animate-spin" />
                  ) : shareSuccess ? (
                    <Check size={22} style={{ color: "#22c55e" }} />
                  ) : (
                    <Share2 size={22} style={{ color: "#2C3E50" }} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Button */}
      {(activeTab === "forYou" || (activeTab === "explore" && selectedCategory)) && (
        <div
          className={cn(
            "pb-8 px-8 flex justify-center transition-all duration-400",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <button
            onClick={activeTab === "forYou" ? handleNextQuote : handleNextCategoryQuote}
            className="w-full max-w-[340px] h-14 rounded-[28px] text-lg font-semibold flex items-center justify-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "#2C3E50",
              color: "white",
              boxShadow: "0 4px 16px rgba(44, 62, 80, 0.25)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {activeTab === "forYou"
              ? (isLastQuote ? "Pick Another Mood" : `(${currentQuoteIndex + 1}/${filteredQuotes.length})`)
              : (isLastCategoryQuote ? "Explore More" : `(${categoryQuoteIndex + 1}/${filteredCategoryQuotes.length})`)
            }
          </button>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={handlePremiumModalClose}
        onUpgrade={() => {
          setShowPremiumModal(false);
          navigate("/premium");
        }}
        {...getPremiumModalContent()}
      />
    </main>
  );
};

export default Quotes;
