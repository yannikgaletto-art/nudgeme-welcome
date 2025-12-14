import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Check, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, cancel your subscription anytime from Settings. You'll keep premium access until the end of your billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay through secure Stripe payment processing."
  },
  {
    question: "Do I really get a 7-day free trial?",
    answer: "Absolutely! Try all premium features free for 7 days. You won't be charged until the trial ends, and you can cancel before then."
  },
  {
    question: "Can I switch from monthly to annual?",
    answer: "Yes, upgrade to annual anytime from your account settings and save 40% immediately."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use Stripe for payment processing. We never store your credit card details on our servers."
  }
];

const features = [
  { icon: "❤️", title: "Save Unlimited Quotes", description: "Never worry about storage limits. Save every quote that resonates with you and build your personal collection." },
  { icon: "📚", title: "Expanded Quote Library", description: "Access 200+ additional quotes from exclusive categories including Innovation, Art, Leadership, and more." },
  { icon: "🌙", title: "Beautiful Dark Mode", description: "Easy on the eyes during evening practice. Switch between light and dark themes seamlessly." },
  { icon: "📸", title: "Share as Images", description: "Create stunning quote images with custom backgrounds. Perfect for Instagram, Twitter, or your mood board." },
  { icon: "🗂️", title: "Organize Your Way", description: "Create personal quote collections. Curate categories for different life areas or projects." },
  { icon: "🔔", title: "Unlimited Smart Reminders", description: "Set multiple daily reminders. Our intelligent system learns your optimal mindfulness times." },
];

const testimonials = [
  { initial: "S", name: "Sarah K.", quote: "This app changed my mornings completely.", gradient: "linear-gradient(135deg, #FFB88C 0%, #FF7676 100%)" },
  { initial: "M", name: "Michael R.", quote: "The quotes feel personally curated for me.", gradient: "linear-gradient(135deg, #A8C5B5 0%, #7BA899 100%)" },
  { initial: "J", name: "Jessica L.", quote: "Worth every penny for the peace of mind.", gradient: "linear-gradient(135deg, #B4D7E8 0%, #8BBDD9 100%)" },
];

const Premium = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleStartTrial = () => {
    toast({ 
      title: "Coming Soon!", 
      description: "Premium subscriptions will be available shortly.",
      duration: 3000 
    });
  };

  const handleRestorePurchase = () => {
    toast({ 
      title: "Checking...", 
      description: "Looking for existing purchases.",
      duration: 2000 
    });
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    toast({ 
      title: "Invalid code", 
      description: "This promo code is not valid.",
      variant: "destructive",
      duration: 2000 
    });
    setPromoCode("");
  };

  return (
    <main className="min-h-screen w-full flex flex-col animate-slide-in-right" style={{ background: "linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, #F5E6D3 20%)" }}>
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
        <h1
          className="text-lg font-medium"
          style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
        >
          NudgeMe Premium
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Hero Section */}
        <div className={cn(
          "text-center px-6 pt-4 pb-8 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="text-7xl mb-4 block">👑</span>
          <h2
            className="text-[28px] font-semibold leading-tight mb-3 max-w-[320px] mx-auto"
            style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
          >
            Unlock Your Full Mindfulness Journey
          </h2>
          <p
            className="text-base leading-relaxed max-w-[300px] mx-auto"
            style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
          >
            Get unlimited access to premium features designed to deepen your practice.
          </p>
        </div>

        {/* Features List */}
        <div className="px-6 space-y-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:border-opacity-60",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                backgroundColor: "white",
                border: "2px solid rgba(255, 215, 0, 0.2)",
                transitionDelay: `${50 + index * 50}ms`,
              }}
            >
              <span className="text-4xl flex-shrink-0">{feature.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Check size={16} style={{ color: "#FFD700" }} />
                  <h3
                    className="font-semibold text-base"
                    style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(107, 107, 107, 0.9)", fontFamily: "Inter, sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className={cn(
          "px-6 mt-10 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: "400ms" }}>
          <h3
            className="text-center font-semibold text-lg mb-4"
            style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
          >
            Loved by Mindful People
          </h3>
          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ backgroundColor: "rgba(44, 62, 80, 0.04)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: t.gradient }}
                >
                  {t.initial}
                </div>
                <p className="text-sm italic flex-1" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
                  "{t.quote}" — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className={cn(
          "px-6 mt-10 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: "500ms" }}>
          <h3
            className="text-center font-medium text-2xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
          >
            Choose Your Plan
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <div
              className="rounded-[20px] p-5"
              style={{ backgroundColor: "white", border: "2px solid rgba(44, 62, 80, 0.15)" }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
              >
                Free
              </span>
              <div className="mt-2 mb-3">
                <span className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}>€0</span>
                <span className="text-sm ml-1" style={{ color: "#6B6B6B" }}>/forever</span>
              </div>
              <div className="space-y-2">
                {["61 curated quotes", "4-7-8 breathing", "Save up to 20", "Basic sharing", "Core categories"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={14} style={{ color: "#6B6B6B" }} />
                    <span className="text-xs" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                disabled
                className="w-full h-10 mt-4 rounded-full text-sm font-medium"
                style={{ backgroundColor: "rgba(44, 62, 80, 0.1)", color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
              >
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div
              className="rounded-[20px] p-5 relative premium-shimmer"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                boxShadow: "0 8px 24px rgba(255, 215, 0, 0.3)",
              }}
            >
              <div
                className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#2C3E50", color: "white", fontFamily: "Inter, sans-serif" }}
              >
                Most Popular
              </div>
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "white", fontFamily: "Inter, sans-serif" }}
              >
                Premium
              </span>
              <div className="mt-2 mb-3">
                <span className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "white" }}>
                  {isAnnual ? "€29.99" : "€4.99"}
                </span>
                <span className="text-sm ml-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {isAnnual ? "/year" : "/month"}
                </span>
              </div>
              <div className="space-y-2">
                {["Everything in Free", "200+ exclusive quotes", "Unlimited saves", "Dark mode", "Export images", "Smart reminders"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={14} style={{ color: "white" }} />
                    <span className="text-xs font-medium" style={{ color: "white", fontFamily: "Inter, sans-serif" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleStartTrial}
                className="w-full h-10 mt-4 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "white", color: "#FFA500", fontFamily: "Inter, sans-serif" }}
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Annual Toggle */}
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-full mt-4 p-3 rounded-2xl text-center transition-all duration-200"
            style={{
              backgroundColor: isAnnual ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 215, 0, 0.1)",
              border: isAnnual ? "2px solid rgba(255, 215, 0, 0.5)" : "2px solid transparent",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              {isAnnual ? "✓ " : ""}Save 40% with Annual Plan — €29.99/year
            </span>
            {isAnnual && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#22c55e", color: "white" }}
              >
                Save €30
              </span>
            )}
          </button>

          {/* Trial Info */}
          <p className="text-center mt-4 text-xs" style={{ color: "rgba(107, 107, 107, 0.7)", fontFamily: "Inter, sans-serif" }}>
            7-day free trial, cancel anytime
          </p>

          {/* Money-back guarantee */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield size={16} style={{ color: "#2C3E50" }} />
            <span className="text-sm font-medium" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              30-day money-back guarantee
            </span>
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <button
              onClick={() => setShowPromo(!showPromo)}
              className="w-full text-center text-sm underline"
              style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
            >
              Have a promo code?
            </button>
            {showPromo && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 h-11 px-4 rounded-full text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "white",
                    border: "1.5px solid rgba(44, 62, 80, 0.2)",
                    color: "#2C3E50",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  className="h-11 px-5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: "#2C3E50", color: "white", fontFamily: "Inter, sans-serif" }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className={cn(
          "px-6 mt-10 transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )} style={{ transitionDelay: "600ms" }}>
          <h3
            className="font-semibold text-lg mb-4"
            style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
          >
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "white" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span
                    className="font-medium text-[15px] pr-4"
                    style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
                  >
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp size={18} style={{ color: "#6B6B6B" }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: "#6B6B6B" }} />
                  )}
                </button>
                {openFaq === index && (
                  <div
                    className="px-4 pb-4 text-sm leading-relaxed"
                    style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif", backgroundColor: "rgba(44, 62, 80, 0.02)" }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-6 mt-10">
          <button
            onClick={handleStartTrial}
            className="w-full max-w-[340px] mx-auto h-14 rounded-full font-semibold text-base flex items-center justify-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] premium-shimmer"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              color: "white",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 8px 24px rgba(255, 215, 0, 0.3)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
              display: "block",
            }}
          >
            Get Premium Now
          </button>

          {/* Restore Purchase */}
          <button
            onClick={handleRestorePurchase}
            className="w-full text-center mt-4 text-sm underline"
            style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
          >
            Restore Previous Purchase
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 mt-8 pb-6">
          <p
            className="text-center text-xs leading-relaxed"
            style={{ color: "rgba(107, 107, 107, 0.5)", fontFamily: "Inter, sans-serif" }}
          >
            By subscribing, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Premium;
