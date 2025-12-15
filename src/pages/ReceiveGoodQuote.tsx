import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emotionQuotes, EmotionType, EmotionQuote, getRandomQuoteForEmotion } from "@/data/emotionQuotes";

const ReceiveGoodQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as EmotionType) || "calm";
  
  const [quote, setQuote] = useState<EmotionQuote | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get random quote for the user's emotion
    const selectedQuote = getRandomQuoteForEmotion(mood);
    setQuote(selectedQuote);
    
    // Trigger animations
    setTimeout(() => setIsLoaded(true), 100);
  }, [mood]);

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!quote) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <div className="flex flex-col items-center max-w-[600px] text-center">
        {/* Quote text */}
        <p
          className={cn(
            "text-[22px] md:text-[28px] italic leading-[1.6] transition-all duration-600",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
          )}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          "{quote.text}"
        </p>

        {/* Author */}
        <p
          className={cn(
            "mt-6 text-base font-medium transition-all duration-400",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            color: "#6B7280",
            transitionDelay: "300ms",
          }}
        >
          — {quote.author}
        </p>
      </div>

      {/* Back to Home button */}
      <div
        className={cn(
          "fixed bottom-[60px] left-0 right-0 px-6 flex justify-center transition-all duration-400",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <Button
          onClick={handleBackToHome}
          className={cn(
            "h-14 rounded-full px-8",
            "bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white",
            "max-w-[400px] w-full",
            "font-semibold text-base"
          )}
          style={{
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.2)",
          }}
        >
          Back to Home
        </Button>
      </div>
    </main>
  );
};

export default ReceiveGoodQuote;
