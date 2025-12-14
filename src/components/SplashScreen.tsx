import { useEffect, useState } from "react";
import NudgeLogo from "@/components/NudgeLogo";

interface SplashScreenProps {
  onReady: () => void;
  minDuration?: number;
}

const SplashScreen = ({ onReady, minDuration = 500 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        onReady();
      }, 300);
    }, minDuration);

    // Timeout fallback after 3 seconds
    const fallbackTimer = setTimeout(() => {
      if (isVisible) {
        console.warn("Splash screen timeout - forcing ready state");
        setIsFading(true);
        setTimeout(() => {
          setIsVisible(false);
          onReady();
        }, 300);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [minDuration, onReady, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <div className="animate-pulse">
        <NudgeLogo />
      </div>
      <p
        className="mt-6 text-sm"
        style={{ color: "rgba(44, 62, 80, 0.6)", fontFamily: "Inter, sans-serif" }}
      >
        Loading...
      </p>
    </div>
  );
};

export default SplashScreen;
