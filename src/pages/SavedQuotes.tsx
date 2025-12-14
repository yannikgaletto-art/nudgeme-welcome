import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Trash2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SavedQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  savedAt: number;
}

const STORAGE_KEY = "nudgeme_saved_quotes";

const SavedQuotes = () => {
  const navigate = useNavigate();
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SavedQuote[];
      setSavedQuotes(parsed.sort((a, b) => b.savedAt - a.savedAt));
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      const newSaved = savedQuotes.filter(q => q.id !== id);
      setSavedQuotes(newSaved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      setRemovingId(null);
      setConfirmRemove(null);
      toast({ title: "Removed", description: "Quote removed from saved." });
    }, 300);
  };

  const handleClearAll = () => {
    setSavedQuotes([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    toast({ title: "Cleared", description: "All saved quotes removed." });
  };

  const handleShare = async (quote: SavedQuote) => {
    if (sharingId) return;
    
    setSharingId(quote.id);
    
    // Truncate long quotes for compatibility (280 char limit)
    const truncatedText = quote.text.length > 200 
      ? quote.text.slice(0, 197) + "..." 
      : quote.text;
    const formattedText = `"${truncatedText}"\n\n— ${quote.author}\n\nShared from NudgeMe`;
    
    const canCopy = typeof navigator.clipboard?.writeText === "function";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const canShare = typeof navigator.share === "function" && isMobile;
    
    let success = false;
    
    try {
      // Method 1: Try clipboard first (most compatible)
      if (canCopy) {
        await navigator.clipboard.writeText(formattedText);
        console.log("Share:", { quote: truncatedText, author: quote.author, method: "clipboard", source: "saved" });
        toast({
          title: "Quote copied to clipboard!",
          duration: 2000,
        });
        success = true;
      }
      // Method 2: Try Web Share API on mobile only
      else if (canShare) {
        await navigator.share({
          title: "NudgeMe Quote",
          text: formattedText,
        });
        console.log("Share:", { quote: truncatedText, author: quote.author, method: "native", source: "saved" });
        success = true;
      }
      // Method 3: Fallback - show manual copy toast
      else {
        toast({
          title: "Copy manually:",
          description: formattedText.slice(0, 100) + "...",
          duration: 5000,
        });
      }
      
      if (success) {
        setShareSuccessId(quote.id);
        setTimeout(() => setShareSuccessId(null), 500);
      }
    } catch (err: unknown) {
      const error = err as Error;
      // Silent on user cancel
      if (error.name === "AbortError") {
        // User canceled share - do nothing
      } else if (error.name === "NotAllowedError") {
        toast({
          title: "Please allow clipboard access",
          variant: "destructive",
          duration: 2000,
        });
      } else {
        // Try Web Share as fallback if clipboard failed
        if (canShare) {
          try {
            await navigator.share({ title: "NudgeMe Quote", text: formattedText });
            setShareSuccessId(quote.id);
            setTimeout(() => setShareSuccessId(null), 500);
          } catch {
            toast({
              title: "Sharing failed. Try again.",
              variant: "destructive",
              duration: 2000,
            });
          }
        } else {
          toast({
            title: "Sharing failed. Try again.",
            variant: "destructive",
            duration: 2000,
          });
        }
      }
    } finally {
      setSharingId(null);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F5E6D3" }}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-6 h-[60px] transition-all duration-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: "rgba(44, 62, 80, 0.6)" }}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
          Saved Quotes
        </h1>
        {savedQuotes.length > 0 ? (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
          >
            Clear All
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {savedQuotes.length === 0 ? (
          /* Empty State */
          <div
            className={cn(
              "flex-1 flex flex-col items-center justify-center min-h-[60vh] transition-all duration-300",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <Heart size={64} style={{ color: "rgba(44, 62, 80, 0.3)" }} strokeWidth={1.5} />
            <p className="mt-6 text-lg font-medium" style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}>
              No saved quotes yet
            </p>
            <p className="mt-2 text-sm" style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
              Tap ❤️ on any quote to save it
            </p>
          </div>
        ) : (
          /* Quote List */
          <div className="flex flex-col gap-4 mt-4">
            {savedQuotes.map((quote, index) => (
              <div
                key={quote.id}
                className={cn(
                  "relative w-full min-h-[140px] rounded-[20px] p-6 transition-all duration-300",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  removingId === quote.id && "opacity-0 -translate-x-full"
                )}
                style={{
                  backgroundColor: "white",
                  border: "1.5px solid rgba(44, 62, 80, 0.2)",
                  transitionDelay: `${50 * index}ms`,
                }}
              >
                {/* Source Badge */}
                <div
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    backgroundColor: "#F5E6D3",
                    color: "#2C3E50",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {quote.source}
                </div>

                {/* Quote Text */}
                <p
                  className="text-lg font-medium leading-relaxed pr-20 line-clamp-3"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#2C3E50" }}
                >
                  "{quote.text}"
                </p>

                {/* Author */}
                <p className="mt-3 text-[13px] italic" style={{ color: "rgba(44, 62, 80, 0.7)" }}>
                  — {quote.author}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button
                    onClick={() => handleShare(quote)}
                    disabled={sharingId === quote.id}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200",
                      sharingId !== quote.id && "hover:scale-105 active:scale-95",
                      sharingId === quote.id && "opacity-60 cursor-not-allowed"
                    )}
                    style={{ 
                      border: "1.5px solid rgba(44, 62, 80, 0.2)",
                      transform: shareSuccessId === quote.id ? "scale(1.2)" : undefined,
                    }}
                    aria-label="Share this quote"
                  >
                    {sharingId === quote.id ? (
                      <Loader2 size={16} style={{ color: "#2C3E50" }} className="animate-spin" />
                    ) : shareSuccessId === quote.id ? (
                      <Check size={16} style={{ color: "#22c55e" }} />
                    ) : (
                      <Share2 size={16} style={{ color: "#2C3E50" }} />
                    )}
                  </button>
                  {confirmRemove === quote.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemove(quote.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full transition-all hover:opacity-80"
                        style={{ backgroundColor: "#E63946", color: "white", fontFamily: "Inter, sans-serif" }}
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setConfirmRemove(null)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(44, 62, 80, 0.1)", color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemove(quote.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ border: "1.5px solid rgba(44, 62, 80, 0.2)" }}
                      aria-label="Remove quote"
                    >
                      <Trash2 size={16} style={{ color: "#E63946" }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedQuotes;
