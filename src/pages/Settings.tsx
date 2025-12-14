import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Settings2, Share2, Star, Mail, FileText, Trash2, Download, Upload, HelpCircle, Heart, FolderOpen, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AppSettings {
  dailyReminders: boolean;
  quoteLength: string;
  darkMode: boolean;
}

const SETTINGS_KEY = "nudgeme_settings";
const SAVED_KEY = "nudgeme_saved_quotes";

const Settings = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    dailyReminders: false,
    quoteLength: "all",
    darkMode: false,
  });
  const [savedCount, setSavedCount] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Load settings
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
    // Load saved count
    const saved = localStorage.getItem(SAVED_KEY);
    if (saved) {
      setSavedCount(JSON.parse(saved).length);
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleClearData = () => {
    localStorage.removeItem(SAVED_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    setSavedCount(0);
    setSettings({ dailyReminders: false, quoteLength: "all", darkMode: false });
    setShowClearConfirm(false);
    toast({ title: "All data cleared", duration: 2000 });
  };

  const handleExportData = () => {
    const saved = localStorage.getItem(SAVED_KEY);
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    const exportData = {
      savedQuotes: saved ? JSON.parse(saved) : [],
      settings: settingsData ? JSON.parse(settingsData) : {},
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nudgeme-quotes-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported successfully", duration: 2000 });
  };

  const handleShareApp = async () => {
    const shareText = "NudgeMe - Take a moment with yourself. Daily quotes for your peace of mind.";
    const canCopy = typeof navigator.clipboard?.writeText === "function";
    try {
      if (canCopy) {
        await navigator.clipboard.writeText(shareText);
        toast({ title: "Share text copied!", duration: 2000 });
      }
    } catch {
      toast({ title: "Sharing failed", variant: "destructive", duration: 2000 });
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled = false }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      onClick={disabled ? undefined : onToggle}
      className={cn(
        "w-12 h-7 rounded-full relative transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{ backgroundColor: enabled ? "#2C3E50" : "#D8D8D8" }}
      aria-checked={enabled}
      role="switch"
      disabled={disabled}
    >
      <div
        className="w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow-sm"
        style={{ left: enabled ? "22px" : "2px" }}
      />
    </button>
  );

  const SettingsItem = ({ 
    icon, 
    label, 
    sublabel, 
    onClick, 
    rightContent,
    danger = false,
    delay = 0
  }: { 
    icon: React.ReactNode; 
    label: string; 
    sublabel?: string; 
    onClick?: () => void;
    rightContent?: React.ReactNode;
    danger?: boolean;
    delay?: number;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-[0.98]",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{
        backgroundColor: "white",
        border: "1.5px solid rgba(44, 62, 80, 0.15)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-10 h-10 flex items-center justify-center text-xl">{icon}</div>
      <div className="flex-1 text-left">
        <p className="font-medium text-[15px]" style={{ color: danger ? "#E63946" : "#2C3E50", fontFamily: "Inter, sans-serif" }}>
          {label}
        </p>
        {sublabel && (
          <p className="text-[13px] mt-0.5" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
            {sublabel}
          </p>
        )}
      </div>
      {rightContent || (onClick && <ChevronRight size={20} style={{ color: "rgba(44, 62, 80, 0.4)" }} />)}
    </button>
  );

  const SectionHeader = ({ title, delay = 0 }: { title: string; delay?: number }) => (
    <h3
      className={cn(
        "text-xs font-semibold uppercase tracking-wider px-6 mt-6 mb-3 transition-all duration-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif", letterSpacing: "0.5px", transitionDelay: `${delay}ms` }}
    >
      {title}
    </h3>
  );

  const PremiumBadge = () => (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
      style={{
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        color: "#5C4700",
      }}
    >
      <Lock size={10} />
      Premium
    </div>
  );

  return (
    <main className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-5 h-[60px] transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
          Settings
        </h1>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* About Section */}
        <div className="px-6 mt-4">
          <div
            className={cn(
              "rounded-[20px] p-6 flex flex-col items-center transition-all duration-300",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ backgroundColor: "white", boxShadow: "0 4px 16px rgba(44, 62, 80, 0.08)" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: "#F5E6D3" }}>
              <Settings2 size={28} style={{ color: "#2C3E50" }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              NudgeMe
            </h2>
            <p className="text-sm mt-1" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
              Take a moment with yourself
            </p>
            <p className="text-xs mt-3" style={{ color: "rgba(44, 62, 80, 0.5)", fontFamily: "Inter, sans-serif" }}>
              Version 1.0.0
            </p>
          </div>
        </div>

        {/* Preferences */}
        <SectionHeader title="Preferences" delay={100} />
        <div className="px-6 space-y-3">
          <SettingsItem
            icon="🔔"
            label="Daily Reminders"
            sublabel="Get nudged daily"
            delay={150}
            rightContent={
              <ToggleSwitch
                enabled={settings.dailyReminders}
                onToggle={() => updateSetting("dailyReminders", !settings.dailyReminders)}
              />
            }
          />
          <SettingsItem
            icon="📏"
            label="Quote Length"
            sublabel={settings.quoteLength === "all" ? "All lengths" : settings.quoteLength.charAt(0).toUpperCase() + settings.quoteLength.slice(1)}
            delay={200}
            onClick={() => {
              const lengths = ["all", "short", "medium", "long"];
              const current = lengths.indexOf(settings.quoteLength);
              const next = lengths[(current + 1) % lengths.length];
              updateSetting("quoteLength", next);
              toast({ title: `Quote length: ${next === "all" ? "All lengths" : next}`, duration: 1500 });
            }}
          />
          <SettingsItem
            icon="🌙"
            label="Dark Mode"
            sublabel="Coming soon"
            delay={250}
            rightContent={
              <div className="flex items-center gap-2">
                <PremiumBadge />
                <ToggleSwitch enabled={settings.darkMode} onToggle={() => {}} disabled />
              </div>
            }
          />
        </div>

        {/* Content */}
        <SectionHeader title="Content" delay={300} />
        <div className="px-6 space-y-3">
          <SettingsItem
            icon={<BookOpen size={20} style={{ color: "#2C3E50" }} />}
            label="61 quotes available"
            sublabel="21 mood-based + 40 categories"
            delay={350}
          />
          <SettingsItem
            icon={<Heart size={20} style={{ color: "#E63946" }} />}
            label={`${savedCount} quotes saved`}
            sublabel="Tap to view"
            delay={400}
            onClick={() => navigate("/saved")}
          />
          <SettingsItem
            icon={<FolderOpen size={20} style={{ color: "#2C3E50" }} />}
            label="8 categories"
            sublabel="Spirituality, Politics, Philosophy..."
            delay={450}
            onClick={() => navigate("/quotes", { state: { tab: "explore" } })}
          />
        </div>

        {/* Support & Legal */}
        <SectionHeader title="Support & Legal" delay={500} />
        <div className="px-6 space-y-3">
          <SettingsItem
            icon={<HelpCircle size={20} style={{ color: "#2C3E50" }} />}
            label="How to Use"
            sublabel="View tutorial"
            delay={550}
            onClick={() => navigate("/")}
          />
          <SettingsItem
            icon={<Share2 size={20} style={{ color: "#2C3E50" }} />}
            label="Share NudgeMe"
            sublabel="Share with friends"
            delay={600}
            onClick={handleShareApp}
          />
          <SettingsItem
            icon={<Star size={20} style={{ color: "#FFD700" }} />}
            label="Rate Us"
            sublabel="Coming soon"
            delay={650}
            onClick={() => toast({ title: "Coming soon!", duration: 1500 })}
          />
          <SettingsItem
            icon={<Lock size={20} style={{ color: "#2C3E50" }} />}
            label="Privacy Policy"
            sublabel="We don't collect personal data"
            delay={700}
            onClick={() => toast({ title: "All data stored locally on your device", duration: 3000 })}
          />
          <SettingsItem
            icon={<FileText size={20} style={{ color: "#2C3E50" }} />}
            label="Terms of Service"
            delay={750}
            onClick={() => toast({ title: "Use NudgeMe for your peace of mind", duration: 2000 })}
          />
          <SettingsItem
            icon={<Mail size={20} style={{ color: "#2C3E50" }} />}
            label="Contact"
            sublabel="support@nudgeme.app"
            delay={800}
            onClick={() => window.open("mailto:support@nudgeme.app")}
          />
        </div>

        {/* Advanced */}
        <SectionHeader title="Advanced" delay={850} />
        <div className="px-6 space-y-3">
          <SettingsItem
            icon={<Download size={20} style={{ color: "#2C3E50" }} />}
            label="Export Data"
            sublabel="Download backup file"
            delay={900}
            onClick={handleExportData}
          />
          <SettingsItem
            icon={<Upload size={20} style={{ color: "#2C3E50" }} />}
            label="Import Data"
            sublabel="Coming soon"
            delay={950}
            onClick={() => toast({ title: "Coming soon!", duration: 1500 })}
          />
          <SettingsItem
            icon={<Trash2 size={20} style={{ color: "#E63946" }} />}
            label="Clear All Data"
            sublabel="Remove saved quotes and settings"
            danger
            delay={1000}
            onClick={() => setShowClearConfirm(true)}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pb-8 text-center">
          <p className="text-xs" style={{ color: "rgba(44, 62, 80, 0.5)", fontFamily: "Inter, sans-serif" }}>
            Made with care for your peace of mind
          </p>
          <p className="text-xs mt-2" style={{ color: "rgba(44, 62, 80, 0.5)", fontFamily: "Inter, sans-serif" }}>
            © 2025 NudgeMe
          </p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6"
            style={{ backgroundColor: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              Clear All Data?
            </h3>
            <p className="text-sm mb-6" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
              This will remove all saved quotes and settings. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 h-12 rounded-full font-semibold text-sm transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(44, 62, 80, 0.1)", color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 h-12 rounded-full font-semibold text-sm transition-all hover:opacity-80"
                style={{ backgroundColor: "#E63946", color: "white", fontFamily: "Inter, sans-serif" }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Settings;
