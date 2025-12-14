import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, Heart, Moon, Image, BookOpen, Bell, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const Premium = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useState(() => {
    setTimeout(() => setIsLoaded(true), 100);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({ title: "Thanks! We'll notify you when Premium launches.", duration: 3000 });
  };

  const features = [
    { icon: <Heart size={24} style={{ color: "#E63946" }} />, title: "Unlimited Saves", description: "Save as many quotes as you want" },
    { icon: <Moon size={24} style={{ color: "#8B7EC8" }} />, title: "Dark Mode", description: "Easy on the eyes, beautiful at night" },
    { icon: <Image size={24} style={{ color: "#4A90E2" }} />, title: "Export as Images", description: "Create stunning shareable quote cards" },
    { icon: <BookOpen size={24} style={{ color: "#A8C5B5" }} />, title: "200+ More Quotes", description: "Exclusive categories and authors" },
    { icon: <Bell size={24} style={{ color: "#FFD700" }} />, title: "Smart Reminders", description: "Unlimited custom notification times" },
    { icon: <FolderPlus size={24} style={{ color: "#2C3E50" }} />, title: "Custom Categories", description: "Organize quotes your way" },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-5 h-[60px] transition-all duration-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}>
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs premium-shimmer"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            color: "white",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Sparkles size={14} />
          Premium
        </div>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8 px-6">
        {/* Hero */}
        <div className={cn(
          "text-center mt-4 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h1
            className="text-3xl font-medium mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
          >
            Unlock Your Full
            <br />
            <span style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Mindfulness Journey
            </span>
          </h1>
          <p className="text-base" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
            Get the most out of NudgeMe
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "rounded-2xl p-4 transition-all duration-300",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)",
                transitionDelay: `${100 + index * 50}ms`,
              }}
            >
              <div className="mb-2">{feature.icon}</div>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-xs" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Coming Soon Card */}
        <div
          className={cn(
            "mt-8 rounded-3xl p-6 text-center transition-all duration-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)",
            border: "2px solid rgba(255, 215, 0, 0.3)",
            transitionDelay: "400ms",
          }}
        >
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
          >
            Coming Soon ✨
          </h2>
          <p className="text-sm mb-4" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
            Be the first to know when Premium launches
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-full text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid rgba(44, 62, 80, 0.2)",
                  color: "#2C3E50",
                  fontFamily: "Inter, sans-serif",
                }}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  color: "white",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {isSubmitting ? "..." : "Notify Me"}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 h-12">
              <Check size={20} style={{ color: "#22c55e" }} />
              <span className="font-medium" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
                You're on the list!
              </span>
            </div>
          )}
        </div>

        {/* Comparison */}
        <div
          className={cn(
            "mt-8 transition-all duration-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "500ms" }}
        >
          <h3 className="text-center font-semibold mb-4" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
            Free vs Premium
          </h3>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)" }}>
            <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(44, 62, 80, 0.05)" }}>
                  <th className="text-left p-3 font-semibold" style={{ color: "#2C3E50" }}>Feature</th>
                  <th className="text-center p-3 font-semibold" style={{ color: "#6B6B6B" }}>Free</th>
                  <th className="text-center p-3 font-semibold" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: "1px solid rgba(44, 62, 80, 0.1)" }}>
                  <td className="p-3" style={{ color: "#2C3E50" }}>Saved Quotes</td>
                  <td className="text-center p-3" style={{ color: "#6B6B6B" }}>20</td>
                  <td className="text-center p-3" style={{ color: "#FFD700" }}>Unlimited</td>
                </tr>
                <tr style={{ borderTop: "1px solid rgba(44, 62, 80, 0.1)" }}>
                  <td className="p-3" style={{ color: "#2C3E50" }}>Quote Library</td>
                  <td className="text-center p-3" style={{ color: "#6B6B6B" }}>61</td>
                  <td className="text-center p-3" style={{ color: "#FFD700" }}>260+</td>
                </tr>
                <tr style={{ borderTop: "1px solid rgba(44, 62, 80, 0.1)" }}>
                  <td className="p-3" style={{ color: "#2C3E50" }}>Dark Mode</td>
                  <td className="text-center p-3" style={{ color: "#6B6B6B" }}>—</td>
                  <td className="text-center p-3" style={{ color: "#22c55e" }}>✓</td>
                </tr>
                <tr style={{ borderTop: "1px solid rgba(44, 62, 80, 0.1)" }}>
                  <td className="p-3" style={{ color: "#2C3E50" }}>Image Export</td>
                  <td className="text-center p-3" style={{ color: "#6B6B6B" }}>—</td>
                  <td className="text-center p-3" style={{ color: "#22c55e" }}>✓</td>
                </tr>
                <tr style={{ borderTop: "1px solid rgba(44, 62, 80, 0.1)" }}>
                  <td className="p-3" style={{ color: "#2C3E50" }}>Custom Categories</td>
                  <td className="text-center p-3" style={{ color: "#6B6B6B" }}>—</td>
                  <td className="text-center p-3" style={{ color: "#22c55e" }}>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Premium;
