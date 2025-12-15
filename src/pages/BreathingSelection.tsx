import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check, Target, Moon, Zap, Wind, Brain, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreathingTechnique {
  id: string;
  name: string;
  headline: string;
  subheadline: string;
  icon: "target" | "moon" | "zap" | "wind" | "brain" | "heart";
  duration: string;
  durationSeconds: number;
  effectLabel: string;
  bulletPoints: string[];
  attribution: string;
  badge: string;
  badgeColor?: string;
  phases: {
    name: string;
    duration: number;
    label: string;
  }[];
}

export const breathingTechniques: BreathingTechnique[] = [{
  id: "box",
  name: "Box Breathing",
  headline: "Focus & Clarity",
  subheadline: "Box Breathing · 16 sec",
  icon: "target",
  duration: "16 seconds",
  durationSeconds: 16,
  effectLabel: "Balanced Alertness",
  bulletPoints: ["Sharpens mental focus", "Stabilizes under pressure", "Used by elite forces"],
  attribution: "by Navy SEALs (Mark Divine)",
  badge: "Elite Performance",
  phases: [{
    name: "inhale",
    duration: 4,
    label: "Inhale (4s)"
  }, {
    name: "hold",
    duration: 4,
    label: "Hold (4s)"
  }, {
    name: "exhale",
    duration: 4,
    label: "Exhale (4s)"
  }, {
    name: "hold2",
    duration: 4,
    label: "Hold (4s)"
  }]
}, {
  id: "478",
  name: "4-7-8 Breathing",
  headline: "Deep Calm",
  subheadline: "4-7-8 Technique · 19 sec",
  icon: "moon",
  duration: "19 seconds",
  durationSeconds: 19,
  effectLabel: "Deep Relaxation",
  bulletPoints: ["Natural tranquilizer", "Fall asleep faster", "Lowers heart rate"],
  attribution: "by Dr. Andrew Weil",
  badge: "Best for Sleep",
  phases: [{
    name: "inhale",
    duration: 4,
    label: "Inhale (4s)"
  }, {
    name: "hold",
    duration: 7,
    label: "Hold (7s)"
  }, {
    name: "exhale",
    duration: 8,
    label: "Exhale (8s)"
  }]
}, {
  id: "sigh",
  name: "Physiological Sigh",
  headline: "Stress Drop",
  subheadline: "Physio. Sigh · 10-15 sec",
  icon: "zap",
  duration: "10-15 seconds",
  durationSeconds: 12,
  effectLabel: "Rapid Stress Drop",
  bulletPoints: ["Fastest relief method", "Emergency brake for anxiety", "Opens collapsed airways"],
  attribution: "by Prof. Huberman & Prof. Feldman",
  badge: "Science-backed",
  phases: [{
    name: "inhale",
    duration: 4,
    label: "Inhale (4s)"
  }, {
    name: "double-inhale",
    duration: 1,
    label: "Quick Inhale (1s)"
  }, {
    name: "exhale",
    duration: 7,
    label: "Long Exhale (7s)"
  }]
}, {
  id: "car-rage",
  name: "Pursed-Lip Breathing",
  headline: "Car Rage",
  subheadline: "Pursed-Lip · 12-20 sec",
  icon: "wind",
  duration: "12-20 seconds",
  durationSeconds: 16,
  effectLabel: "Anger Relief",
  bulletPoints: ["Calms acute anger fast", "Activates vagus nerve", "Reduces pain anxiety"],
  attribution: "by Clinical Pain Research",
  badge: "Anger Relief",
  phases: [{
    name: "inhale",
    duration: 4,
    label: "Inhale (4s)"
  }, {
    name: "exhale",
    duration: 8,
    label: "Pursed Exhale (8s)"
  }]
}, {
  id: "reduce-brainfog",
  name: "Wim-Hof Breathing",
  headline: "Reduce Brainfog",
  subheadline: "Wim-Hof · 15-25 sec",
  icon: "brain",
  duration: "15-25 seconds",
  durationSeconds: 20,
  effectLabel: "Mental Clarity",
  bulletPoints: ["Instant mental clarity", "Boosts adrenaline safely", "Increases pain tolerance"],
  attribution: "by Radboud University 2024",
  badge: "Clear Mind",
  phases: [{
    name: "inhale",
    duration: 3,
    label: "Deep Inhale (3s)"
  }, {
    name: "exhale",
    duration: 2,
    label: "Let Go (2s)"
  }, {
    name: "hold",
    duration: 15,
    label: "Hold (15s)"
  }]
}, {
  id: "overthinking-healer",
  name: "Resonance Breathing",
  headline: "Overthinking Healer",
  subheadline: "Resonance · 12-24 sec",
  icon: "heart",
  duration: "12-24 seconds",
  durationSeconds: 18,
  effectLabel: "Stop Overthinking",
  bulletPoints: ["Stops rumination loops", "Cardiac coherence", "Natural pain relief"],
  attribution: "by Vagus Nerve Research",
  badge: "Stop Overthinking",
  badgeColor: "#A7C4BC",
  phases: [{
    name: "inhale",
    duration: 5,
    label: "Inhale (5s)"
  }, {
    name: "exhale",
    duration: 5,
    label: "Exhale (5s)"
  }]
}];

// Mood to recommended technique mapping
const moodToTechnique: Record<string, string> = {
  overwhelmed: "sigh",
  anxious: "sigh",
  sad: "478",
  nervous: "478",
  neutral: "box",
  calm: "box",
  energized: "box"
};

// Icon component
const TechniqueIcon = ({
  icon
}: {
  icon: "target" | "moon" | "zap" | "wind" | "brain" | "heart";
}) => {
  const iconProps = {
    size: 48,
    strokeWidth: 2,
    color: "#2C3E50"
  };
  switch (icon) {
    case "target":
      return <Target {...iconProps} aria-label="Focus icon" />;
    case "moon":
      return <Moon {...iconProps} aria-label="Sleep icon" />;
    case "zap":
      return <Zap {...iconProps} aria-label="Panic reset icon" />;
    case "wind":
      return <Wind {...iconProps} aria-label="Anger relief icon" />;
    case "brain":
      return <Brain {...iconProps} aria-label="Mental clarity icon" />;
    case "heart":
      return <Heart {...iconProps} aria-label="Calm heart icon" />;
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
    const recommended = breathingTechniques.find(t => t.id === recommendedId);
    const others = breathingTechniques.filter(t => t.id !== recommendedId);
    return recommended ? [recommended, ...others] : breathingTechniques;
  }, [recommendedId]);
  const handleBack = () => {
    navigate("/mood");
  };
  const handleSkip = () => {
    navigate("/quotes", {
      state: {
        mood
      }
    });
  };
  const handleSelectTechnique = (technique: BreathingTechnique) => {
    setSelectedId(technique.id);
    setTimeout(() => {
      localStorage.setItem("nudgeme_breathing_technique", technique.id);
      localStorage.setItem("nudgeme_last_recommendation", recommendedId);
      navigate("/breathing", {
        state: {
          mood,
          technique
        }
      });
    }, 200);
  };
  const lastUsedId = localStorage.getItem("nudgeme_breathing_technique");
  return <main className="min-h-screen w-full flex flex-col animate-page-enter" style={{
    backgroundColor: "#F5E6D3"
  }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-6">
        <button onClick={handleBack} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="Go back to mood selection">
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-medium" style={{
        fontFamily: "'Playfair Display', serif",
        color: "#2C3E50"
      }}>
          Choose Your Technique
        </h1>

        <button onClick={handleSkip} className="text-sm font-normal transition-colors duration-200" style={{
        color: "rgba(44, 62, 80, 0.6)"
      }} onMouseEnter={e => e.currentTarget.style.color = "#2C3E50"} onMouseLeave={e => e.currentTarget.style.color = "rgba(44, 62, 80, 0.6)"}>
          Skip
        </button>
      </header>

      {/* Page Title Section */}
      <section className="text-center px-6 py-4">
        <h2 className="text-[28px] md:text-[32px] font-semibold leading-[1.3] tracking-[-0.4px] mx-auto max-w-[400px] opacity-0" style={{
        fontFamily: "'Playfair Display', serif",
        color: "#2C3E50",
        animation: "fade-in-up 600ms ease-out forwards"
      }}>Before we nudge you, 
we balance you
      </h2>
        <p className="mt-4 text-base font-normal opacity-0" style={{
        color: "rgba(107, 107, 107, 0.8)",
        animation: "fade-in-up 500ms ease-out forwards",
        animationDelay: "150ms"
      }}>
          Take 10-20 seconds for yourself
        </p>
      </section>

      {/* Technique Cards */}
      <section className="flex-1 px-6 pt-2 pb-6 overflow-y-auto scroll-smooth">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTechniques.map((technique, index) => {
          const isRecommended = technique.id === recommendedId;
          return <button key={technique.id} onClick={() => handleSelectTechnique(technique)} className={cn("relative bg-white rounded-[20px] text-left transition-all duration-200 opacity-0 w-full flex flex-col", selectedId === technique.id ? "scale-[0.98]" : "hover:-translate-y-1 hover:shadow-lg")} style={{
            height: "560px",
            padding: "32px 24px",
            border: "2px solid rgba(44, 62, 80, 0.15)",
            boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)",
            animation: "fade-in-up 500ms ease-out forwards",
            animationDelay: `${200 + index * 50}ms`
          }} aria-label={`Select ${technique.name}, ${technique.duration}${isRecommended ? ", recommended for you" : ""}`}>
                {/* Section 1 - Top Badge Area (28px) */}
                <div className="h-[28px] flex-shrink-0 relative">
                  {isRecommended && <span className="absolute top-0 right-0 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full" style={{
                backgroundColor: "#A8C5B5",
                color: "#FFFFFF"
              }}>
                      FOR YOU
                    </span>}
                  {technique.badgeColor && !isRecommended && <span className="absolute top-0 right-0 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full" style={{
                backgroundColor: technique.badgeColor,
                color: "#FFFFFF"
              }}>
                      POPULAR
                    </span>}
                  {lastUsedId === technique.id && !isRecommended && !technique.badgeColor && <span className="absolute top-0 right-0 flex items-center gap-1 text-[11px] font-medium" style={{
                color: "#6B6B6B"
              }}>
                      <Check size={12} />
                      Last used
                    </span>}
                </div>

                {/* Section 2 - Icon (64px) */}
                <div className="h-[64px] flex-shrink-0 flex items-center justify-center">
                  <TechniqueIcon icon={technique.icon} />
                </div>

                {/* Section 3 - Headline (64px) */}
                <div className="h-[64px] flex-shrink-0 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-center leading-tight line-clamp-2" style={{
                fontFamily: "'Playfair Display', serif",
                color: "#2C3E50"
              }}>
                    {technique.headline}
                  </h3>
                </div>

                {/* Section 4 - Sub-headline (40px) */}
                <div className="h-[40px] flex-shrink-0 flex items-center justify-center">
                  <p className="text-[15px] font-medium text-center line-clamp-2" style={{
                color: "#6B6B6B"
              }}>
                    {technique.subheadline}
                  </p>
                </div>

                {/* Section 5 - Effect Label (32px) */}
                <div className="h-[32px] flex-shrink-0 flex items-center justify-center">
                  
                </div>

                {/* Section 6 - Divider (24px) */}
                <div className="h-[24px] flex-shrink-0 flex items-center justify-center">
                  <div className="w-4/5 h-px" style={{
                backgroundColor: "rgba(44, 62, 80, 0.15)"
              }} />
                </div>

                {/* Section 7 - Bullet Points (140px) */}
                <div className="h-[140px] flex-shrink-0 flex flex-col justify-center gap-3">
                  {technique.bulletPoints.map((point, i) => <div key={i} className="flex items-start gap-2.5 text-sm pl-6" style={{
                color: "rgba(107, 107, 107, 0.85)",
                lineHeight: "1.8"
              }}>
                      <Check size={14} className="flex-shrink-0 mt-1" style={{
                  color: "#6B6B6B"
                }} />
                      <span className="line-clamp-2">{point}</span>
                    </div>)}
                </div>

                {/* Section 8 - Attribution (60px) */}
                <div className="h-[60px] flex-shrink-0 flex items-start pt-2">
                  <p className="text-[13px] font-medium pl-6 line-clamp-2" style={{
                color: "#6B6B6B",
                lineHeight: "1.6"
              }}>
                    {technique.attribution}
                  </p>
                </div>

                {/* Section 9 - Bottom Badge (44px) */}
                <div className="h-[44px] flex-shrink-0 flex items-center justify-center">
                  <span className="text-[11px] font-semibold px-4 py-2 rounded-lg" style={{
                backgroundColor: "#2C3E50",
                color: "#FFFFFF"
              }}>
                    {technique.badge}
                  </span>
                </div>
              </button>;
        })}
        </div>

        {/* Scientific credibility footer */}
        <p className="text-center mt-8 text-xs" style={{
        color: "rgba(107, 107, 107, 0.5)"
      }}>
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
      `}</style>
    </main>;
};
export default BreathingSelection;