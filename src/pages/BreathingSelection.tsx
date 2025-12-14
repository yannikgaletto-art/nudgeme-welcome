import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check, Target, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreathingTechnique {
  id: string;
  name: string;
  headline: string;
  subheadline: string;
  icon: "target" | "moon" | "zap";
  duration: string;
  durationSeconds: number;
  bulletPoints: string[];
  attribution: string;
  badge: string;
  badgeStyle: "gray" | "gold" | "navy";
  visualization: "bar-center" | "bar-right" | "arrow";
  visualizationLabel: string;
  phases: {
    name: string;
    duration: number;
    label: string;
  }[];
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box Breathing",
    headline: "Focus & Clarity",
    subheadline: "Box Breathing · 16 sec",
    icon: "target",
    duration: "16 seconds",
    durationSeconds: 16,
    bulletPoints: [
      "Sharpens mental focus",
      "Stabilizes under pressure",
      "Used by Navy SEALs",
    ],
    attribution: "by Navy SEALs (Mark Divine)",
    badge: "Elite Performance",
    badgeStyle: "navy",
    visualization: "bar-center",
    visualizationLabel: "Balanced Alertness",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "hold", duration: 4, label: "Hold (4s)" },
      { name: "exhale", duration: 4, label: "Exhale (4s)" },
      { name: "hold2", duration: 4, label: "Hold (4s)" },
    ],
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    headline: "Sleep & Deep Calm",
    subheadline: "4-7-8 Technique · 19 sec",
    icon: "moon",
    duration: "19 seconds",
    durationSeconds: 19,
    bulletPoints: [
      "Acts as natural tranquilizer",
      "Helps fall asleep faster",
      "Lowers heart rate",
    ],
    attribution: "by Dr. Andrew Weil",
    badge: "Best for Sleep",
    badgeStyle: "gray",
    visualization: "bar-right",
    visualizationLabel: "Deep Relaxation",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "hold", duration: 7, label: "Hold (7s)" },
      { name: "exhale", duration: 8, label: "Exhale (8s)" },
    ],
  },
  {
    id: "sigh",
    name: "Physiological Sigh",
    headline: "Instant Panic Reset",
    subheadline: "Physiological Sigh · 10-15 sec",
    icon: "zap",
    duration: "10-15 seconds",
    durationSeconds: 12,
    bulletPoints: [
      "Fastest stress reduction",
      '"Emergency brake" for anxiety',
      "Re-opens collapsed airways",
    ],
    attribution: "by Prof. Huberman (Stanford) & Prof. Feldman (UCLA)",
    badge: "Science-backed",
    badgeStyle: "gold",
    visualization: "arrow",
    visualizationLabel: "Rapid Drop",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "double-inhale", duration: 1, label: "Quick Inhale (1s)" },
      { name: "exhale", duration: 7, label: "Long Exhale (7s)" },
    ],
  },
];

// Mood to recommended technique mapping
const moodToTechnique: Record<string, string> = {
  overwhelmed: "sigh",
  anxious: "sigh",
  sad: "478",
  nervous: "478",
  neutral: "box",
  calm: "box",
  energized: "box",
};

const getBadgeStyles = (style: "gray" | "gold" | "navy") => {
  switch (style) {
    case "gold":
      return { backgroundColor: "#FFF4C4", color: "#2C3E50" };
    case "navy":
      return { backgroundColor: "#2C3E50", color: "#FFFFFF" };
    default:
      return { backgroundColor: "#E8E8E8", color: "#2C3E50" };
  }
};

// Icon component
const TechniqueIcon = ({ icon }: { icon: "target" | "moon" | "zap" }) => {
  const iconProps = {
    size: 48,
    strokeWidth: 2,
    color: "#2C3E50",
  };

  switch (icon) {
    case "target":
      return <Target {...iconProps} aria-label="Focus icon" />;
    case "moon":
      return <Moon {...iconProps} aria-label="Sleep icon" />;
    case "zap":
      return <Zap {...iconProps} aria-label="Panic reset icon" />;
  }
};

// Nervous System Visualization Components
const NervousSystemBar = ({
  position,
  label,
  animated,
}: {
  position: "center" | "right";
  label: string;
  animated: boolean;
}) => {
  const dotPosition = position === "center" ? "50%" : "85%";

  return (
    <div className="w-full my-4" role="img" aria-label={`Regulation bar showing ${label.toLowerCase()}`}>
      <p className="text-[11px] text-center mb-2" style={{ color: "#6B6B6B" }}>
        {label}
      </p>
      <div className="relative h-8 w-full rounded-2xl overflow-hidden" style={{ backgroundColor: "#E8E8E8" }}>
        {/* Gradient zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[30%] h-full" style={{ backgroundColor: "#FFB3BA" }} />
          <div className="w-[40%] h-full" style={{ backgroundColor: "#A8C5B5" }} />
          <div className="w-[30%] h-full" style={{ backgroundColor: "#B4D7E8" }} />
        </div>
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <span className="text-[10px]" style={{ color: "rgba(107, 107, 107, 0.6)" }}>Stress</span>
          <span className="text-[10px]" style={{ color: "rgba(107, 107, 107, 0.6)" }}>Calm</span>
        </div>
        {/* Indicator dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
          style={{
            backgroundColor: "#2C3E50",
            left: dotPosition,
            transform: "translate(-50%, -50%)",
            transition: animated ? "left 400ms ease-out" : "none",
          }}
        />
      </div>
    </div>
  );
};

const NervousSystemArrow = ({ label, animated }: { label: string; animated: boolean }) => {
  return (
    <div className="w-full my-4" role="img" aria-label={`Arrow showing ${label.toLowerCase()}`}>
      <p className="text-[11px] text-center mb-2" style={{ color: "#6B6B6B" }}>
        {label}
      </p>
      <svg
        viewBox="0 0 200 60"
        className="w-full h-12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB3BA" />
            <stop offset="100%" stopColor="#A8C5B5" />
          </linearGradient>
        </defs>
        {/* Curved arrow path */}
        <path
          d="M20 15 Q60 15, 100 35 Q140 55, 175 45"
          stroke="url(#arrowGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: animated ? "200" : "none",
            strokeDashoffset: animated ? "0" : "none",
            animation: animated ? "draw-arrow 600ms ease-out forwards" : "none",
          }}
        />
        {/* Arrow head */}
        <polygon
          points="175,45 168,38 170,48"
          fill="#A8C5B5"
          style={{
            opacity: animated ? 1 : 1,
            animation: animated ? "fade-in 300ms ease-out 400ms forwards" : "none",
          }}
        />
        {/* Labels */}
        <text x="20" y="12" fill="#6B6B6B" fontSize="8" opacity="0.6">Stress</text>
        <text x="165" y="58" fill="#6B6B6B" fontSize="8" opacity="0.6">Calm</text>
      </svg>
    </div>
  );
};

const BreathingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood || "calm";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set());

  // Determine recommended technique based on mood
  const recommendedId = moodToTechnique[mood.toLowerCase()] || "478";

  // Sort techniques: recommended first, then others
  const sortedTechniques = useMemo(() => {
    const recommended = breathingTechniques.find((t) => t.id === recommendedId);
    const others = breathingTechniques.filter((t) => t.id !== recommendedId);
    return recommended ? [recommended, ...others] : breathingTechniques;
  }, [recommendedId]);

  const handleBack = () => {
    navigate("/mood");
  };

  const handleSkip = () => {
    navigate("/quotes", { state: { mood } });
  };

  const handleSelectTechnique = (technique: BreathingTechnique) => {
    setSelectedId(technique.id);
    setTimeout(() => {
      localStorage.setItem("nudgeme_breathing_technique", technique.id);
      localStorage.setItem("nudgeme_last_recommendation", recommendedId);
      navigate("/breathing", { state: { mood, technique } });
    }, 200);
  };

  const lastUsedId = localStorage.getItem("nudgeme_breathing_technique");

  // Trigger animation when cards become visible
  useMemo(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(new Set(breathingTechniques.map((t) => t.id)));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className="min-h-screen w-full flex flex-col animate-page-enter"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-6">
        <button
          onClick={handleBack}
          className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Go back to mood selection"
        >
          <ArrowLeft size={24} />
        </button>

        <h1
          className="text-xl font-medium"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
          }}
        >
          Choose Your Technique
        </h1>

        <button
          onClick={handleSkip}
          className="text-sm font-normal transition-colors duration-200"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2C3E50")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(44, 62, 80, 0.6)")}
        >
          Skip
        </button>
      </header>

      {/* Page Title Section */}
      <section className="text-center px-6 py-4">
        <h2
          className="text-[28px] md:text-[32px] font-semibold leading-[1.3] tracking-[-0.4px] mx-auto max-w-[400px] opacity-0"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2C3E50",
            animation: "fade-in-up 600ms ease-out forwards",
          }}
        >
          Before we nudge you, we balance you
        </h2>
        <p
          className="mt-4 text-base font-normal opacity-0"
          style={{
            color: "rgba(107, 107, 107, 0.8)",
            animation: "fade-in-up 500ms ease-out forwards",
            animationDelay: "150ms",
          }}
        >
          Take 10-20 seconds for yourself
        </p>
      </section>

      {/* Technique Cards */}
      <section className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {sortedTechniques.map((technique, index) => {
            const isRecommended = technique.id === recommendedId;
            const badgeStyles = getBadgeStyles(technique.badgeStyle);
            const isAnimated = animatedCards.has(technique.id);

            return (
              <button
                key={technique.id}
                onClick={() => handleSelectTechnique(technique)}
                className={cn(
                  "relative bg-white rounded-[20px] p-6 text-left transition-all duration-200 border-2 opacity-0 min-h-[360px] flex flex-col",
                  selectedId === technique.id
                    ? "border-[#2C3E50] scale-[0.98]"
                    : "border-[rgba(44,62,80,0.2)] hover:border-[rgba(44,62,80,0.4)] hover:-translate-y-0.5"
                )}
                style={{
                  animation: "fade-in-up 500ms ease-out forwards",
                  animationDelay: `${200 + index * 50}ms`,
                }}
                aria-label={`Select ${technique.name}, ${technique.duration}${isRecommended ? ", recommended for your mood" : ""}`}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: "#A8C5B5",
                      color: "#FFFFFF",
                    }}
                  >
                    RECOMMENDED
                  </span>
                )}

                {/* Last used indicator */}
                {lastUsedId === technique.id && !isRecommended && (
                  <span
                    className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-medium"
                    style={{ color: "#6B6B6B" }}
                  >
                    <Check size={12} />
                    Last used
                  </span>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <TechniqueIcon icon={technique.icon} />
                </div>

                {/* Headline & Sub-headline */}
                <h3
                  className="text-[22px] font-semibold text-center"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#2C3E50",
                  }}
                >
                  {technique.headline}
                </h3>
                <p
                  className="text-sm font-medium text-center mt-2"
                  style={{ color: "#6B6B6B" }}
                >
                  {technique.subheadline}
                </p>

                {/* Nervous System Visualization */}
                {technique.visualization === "arrow" ? (
                  <NervousSystemArrow label={technique.visualizationLabel} animated={isAnimated} />
                ) : (
                  <NervousSystemBar
                    position={technique.visualization === "bar-center" ? "center" : "right"}
                    label={technique.visualizationLabel}
                    animated={isAnimated}
                  />
                )}

                {/* Bullet Points */}
                <ul className="space-y-2 pl-4 mb-4 flex-1">
                  {technique.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed" style={{ color: "rgba(107, 107, 107, 0.9)" }}>
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#A8C5B5" }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Attribution & Badge */}
                <div className="mt-auto">
                  <p
                    className="text-[11px] italic mb-3"
                    style={{ color: "rgba(107, 107, 107, 0.5)" }}
                  >
                    {technique.attribution}
                  </p>
                  <div className="flex justify-end">
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-1 rounded-md"
                      style={badgeStyles}
                    >
                      {technique.badge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scientific credibility footer */}
        <p
          className="text-center mt-8 text-xs"
          style={{ color: "rgba(107, 107, 107, 0.5)" }}
        >
          All techniques backed by peer-reviewed research and clinical practice.
        </p>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes draw-arrow {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </main>
  );
};

export default BreathingSelection;
