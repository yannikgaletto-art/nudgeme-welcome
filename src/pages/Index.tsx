import { Button } from "@/components/ui/button";
import MoonIcon from "@/components/MoonIcon";

const Index = () => {
  const handleBegin = () => {
    // Future: navigate to next screen with fade transition
    console.log("Beginning mindfulness session...");
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-6">
      {/* Top Section - Header */}
      <header className="pt-[60px] text-center opacity-0 animate-fade-in-up">
        <h1 className="font-display font-semibold text-[40px] md:text-[48px] text-foreground tracking-tight leading-tight">
          NudgeMe
        </h1>
        <p className="mt-3 text-base text-muted-foreground tracking-wide">
          Take a moment with yourself
        </p>
      </header>

      {/* Decorative Element */}
      <div className="mt-8 opacity-0 animate-fade-in-up animation-delay-100">
        <MoonIcon />
      </div>

      {/* Middle Section - Main Question */}
      <section className="mt-20 max-w-[400px] text-center opacity-0 animate-fade-in-up animation-delay-200">
        <h2 className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
          How are you feeling right now?
        </h2>
      </section>

      {/* Bottom Section - CTA */}
      <div className="mt-10 w-full flex justify-center opacity-0 animate-fade-in-up animation-delay-300">
        <Button
          variant="nudge"
          size="cta"
          onClick={handleBegin}
          aria-label="Begin your mindfulness session"
        >
          Let's begin
        </Button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-6 left-0 right-0 text-center opacity-0 animate-fade-in-up animation-delay-400">
        <p className="text-xs text-warm-gray">
          Made with care for your peace of mind
        </p>
      </footer>
    </main>
  );
};

export default Index;
