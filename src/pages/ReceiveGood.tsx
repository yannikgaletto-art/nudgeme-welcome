import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MoodType = "overwhelmed" | "anxious" | "sad" | "nervous" | "neutral" | "calm" | "energized";

interface Quote {
  id: string;
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    id: "1",
    text: "You have power over your mind—not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    id: "2",
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott"
  },
  {
    id: "3",
    text: "You are the sky. Everything else is just the weather.",
    author: "Pema Chödrön"
  },
  {
    id: "4",
    text: "Breathing in, I calm body and mind. Breathing out, I smile.",
    author: "Thich Nhat Hanh"
  },
  {
    id: "5",
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca"
  },
  {
    id: "6",
    text: "The wound is the place where the Light enters you.",
    author: "Rumi"
  },
  {
    id: "7",
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass"
  },
  {
    id: "8",
    text: "Be where you are; otherwise you will miss your life.",
    author: "Buddha"
  },
  {
    id: "9",
    text: "A calm mind, a fit body, and a house full of love. These things cannot be bought—they must be earned.",
    author: "Naval Ravikant"
  },
  {
    id: "10",
    text: "When you realize there is nothing lacking, the whole world belongs to you.",
    author: "Lao Tzu"
  }
];

const ReceiveGood = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood as MoodType;
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Pick a random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const handleNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const handleDone = () => {
    navigate("/");
  };

  if (!currentQuote) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5E6D3" }}>
        <div className="animate-pulse text-[#2C3E50]">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 z-10 flex items-center justify-center px-6" style={{ backgroundColor: "#F5E6D3" }}>
        <button 
          onClick={handleBack} 
          className="absolute left-5 top-7 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200" 
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif font-semibold text-[#2C3E50] text-2xl">
          Your Reward
        </h1>
      </header>

      {/* Content */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        {/* Icon */}
        <div className="mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#2C3E50]/10 flex items-center justify-center">
            <Heart size={32} className="text-[#2C3E50]" />
          </div>
        </div>

        {/* Quote Card */}
        <div 
          className={cn(
            "bg-white rounded-2xl p-8 max-w-[500px] w-full",
            "border-2 border-[#E5E7EB] shadow-lg",
            "transition-all duration-300",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in"
          )}
          style={{ animationDelay: "200ms" }}
        >
          <p className="font-serif text-[22px] sm:text-[26px] text-[#2C3E50] text-center leading-relaxed mb-6">
            "{currentQuote.text}"
          </p>
          <p className="text-[#6B7280] text-center text-sm font-medium">
            — {currentQuote.author}
          </p>
        </div>

        {/* New Quote Button */}
        <button
          onClick={handleNewQuote}
          className="mt-6 flex items-center gap-2 text-[#6B7280] hover:text-[#2C3E50] transition-colors duration-200 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <RefreshCw size={18} />
          <span className="text-sm font-medium">Another quote</span>
        </button>
      </section>

      {/* Done Button */}
      <div 
        className="fixed bottom-8 left-0 right-0 px-6 flex justify-center animate-slide-up-bounce"
        style={{ animationDelay: "600ms" }}
      >
        <Button 
          onClick={handleDone}
          className={cn(
            "h-14 rounded-full px-8",
            "bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white",
            "max-w-[400px] w-full",
            "shadow-lg"
          )}
        >
          Done
        </Button>
      </div>
    </main>
  );
};

export default ReceiveGood;
