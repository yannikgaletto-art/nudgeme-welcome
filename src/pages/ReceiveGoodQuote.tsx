import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { EmotionType, EmotionQuote, getRandomQuoteForEmotion } from "@/data/emotionQuotes";

const ReceiveGoodQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = (location.state?.mood as EmotionType) || "calm";
  
  const [quote, setQuote] = useState<EmotionQuote | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const selectedQuote = getRandomQuoteForEmotion(mood);
    setQuote(selectedQuote);
    setTimeout(() => setIsLoaded(true), 100);
  }, [mood]);

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!quote) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-8"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Quote Card */}
      <div
        className={cn(
          "bg-white border-2 border-[#E5E7EB] rounded-3xl p-8 md:p-12 max-w-[700px] w-full text-center transition-all duration-600",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Decorative Icon */}
        <div
          className={cn(
            "mb-6 transition-all duration-400",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <Sparkles size={32} color="#A7C4BC" className="mx-auto" />
        </div>

        {/* Quote text */}
        <p
          className={cn(
            "text-[22px] md:text-[26px] italic leading-[1.7] mb-5 transition-all duration-400",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
            transitionDelay: "200ms",
          }}
        >
          "{quote.text}"
        </p>

        {/* Author */}
        <p
          className={cn(
            "text-[15px] font-medium mt-5 transition-all duration-400",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            color: "#6B7280",
            transitionDelay: "400ms",
          }}
        >
          — {quote.author}
        </p>
      </div>

      {/* Back to Home button */}
      <div
        className={cn(
          "mt-10 transition-all duration-400",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <Button
          onClick={handleBackToHome}
          className={cn(
            "h-14 rounded-full px-12",
            "bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white",
            "max-w-[400px]",
            "font-semibold text-base",
            "hover:scale-105 transition-transform"
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
