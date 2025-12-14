import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreathingTechnique {
  id: string;
  name: string;
  icon: string;
  duration: string;
  durationSeconds: number;
  benefits: string;
  attribution: string;
  badge: string;
  badgeStyle: "gray" | "gold" | "navy";
  phases: {
    name: string;
    duration: number;
    label: string;
  }[];
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: "478",
    name: "4-7-8 Breathing",
    icon: "🫁",
    duration: "19 seconds",
    durationSeconds: 19,
    benefits: "Natural tranquilizer for the nervous system. Helps fall asleep faster.",
    attribution: "by Dr. Andrew Weil",
    badge: "Best for Sleep",
    badgeStyle: "gray",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "hold", duration: 7, label: "Hold (7s)" },
      { name: "exhale", duration: 8, label: "Exhale (8s)" },
    ],
  },
  {
    id: "sigh",
    name: "Physiological Sigh",
    icon: "😮‍💨",
    duration: "10-15 seconds",
    durationSeconds: 12,
    benefits: "Emergency brake for acute stress. Fastest way to reduce physiological arousal.",
    attribution: "by Prof. Huberman (Stanford) & Prof. Feldman (UCLA)",
    badge: "Science-backed Winner",
    badgeStyle: "gold",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "double-inhale", duration: 1, label: "Quick Inhale (1s)" },
      { name: "exhale", duration: 7, label: "Long Exhale (7s)" },
    ],
  },
  {
    id: "box",
    name: "Box Breathing",
    icon: "⬜",
    duration: "16 seconds",
    durationSeconds: 16,
    benefits: "Sharpens focus and mental clarity under pressure.",
    attribution: "used by Navy SEALs (Mark Divine)",
    badge: "Elite Performance",
    badgeStyle: "navy",
    phases: [
      { name: "inhale", duration: 4, label: "Inhale (4s)" },
      { name: "hold", duration: 4, label: "Hold (4s)" },
      { name: "exhale", duration: 4, label: "Exhale (4s)" },
      { name: "hold2", duration: 4, label: "Hold (4s)" },
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

const BreathingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood || "calm";
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedTechniques.map((technique, index) => {
            const isRecommended = technique.id === recommendedId;
            const badgeStyles = getBadgeStyles(technique.badgeStyle);

            return (
              <button
                key={technique.id}
                onClick={() => handleSelectTechnique(technique)}
                className={cn(
                  "relative bg-white rounded-[20px] p-6 text-left transition-all duration-200 border-2 opacity-0",
                  selectedId === technique.id
                    ? "border-[#2C3E50] scale-[0.98]"
                    : "border-[rgba(44,62,80,0.2)] hover:border-[rgba(44,62,80,0.4)] hover:-translate-y-0.5"
                )}
                style={{
                  animation: "fade-in-up 500ms ease-out forwards",
                  animationDelay: `${200 + index * 100}ms`,
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

                {/* Icon & Name */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-[40px]" role="img" aria-hidden="true">
                    {technique.icon}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "#2C3E50" }}
                    >
                      {technique.name}
                    </h3>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "#6B6B6B" }}
                    >
                      {technique.duration}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "rgba(107, 107, 107, 0.9)" }}
                >
                  {technique.benefits}
                </p>

                {/* Attribution */}
                <p
                  className="text-xs italic mb-3"
                  style={{ color: "rgba(107, 107, 107, 0.7)" }}
                >
                  {technique.attribution}
                </p>

                {/* Technique badge */}
                <span
                  className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                  style={badgeStyles}
                >
                  {technique.badge}
                </span>
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
    </main>
  );
};

export default BreathingSelection;
