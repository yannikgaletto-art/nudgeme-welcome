const PREMIUM_PROMPTS_KEY = "nudgeme_premium_prompts";
const MAYBE_LATER_KEY = "nudgeme_maybe_later";
const BANNER_DISMISSED_KEY = "nudgeme_premium_banner_dismissed";
const FREE_SAVE_LIMIT = 20;

interface PremiumPromptState {
  count: number;
  sessionStart: number;
  lastPromptTime: number;
}

interface MaybeLaterState {
  count: number;
  lastDismissTime: number;
}

// Check if user is premium (always false for now - placeholder)
export const isPremiumUser = (): boolean => {
  return false;
};

// Get free save limit
export const getFreeSaveLimit = (): number => {
  return FREE_SAVE_LIMIT;
};

// Check if save limit reached
export const isSaveLimitReached = (currentCount: number): boolean => {
  if (isPremiumUser()) return false;
  return currentCount >= FREE_SAVE_LIMIT;
};

// Track premium prompt shown
export const trackPremiumPrompt = (): void => {
  try {
    const stored = localStorage.getItem(PREMIUM_PROMPTS_KEY);
    const state: PremiumPromptState = stored 
      ? JSON.parse(stored) 
      : { count: 0, sessionStart: Date.now(), lastPromptTime: 0 };
    
    // Reset if new session (> 30 min since last prompt)
    if (Date.now() - state.lastPromptTime > 30 * 60 * 1000) {
      state.count = 0;
      state.sessionStart = Date.now();
    }
    
    state.count++;
    state.lastPromptTime = Date.now();
    
    localStorage.setItem(PREMIUM_PROMPTS_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error tracking premium prompt:", e);
  }
};

// Check if should show premium prompt (frequency limiting)
export const shouldShowPremiumPrompt = (): boolean => {
  if (isPremiumUser()) return false;
  
  try {
    const stored = localStorage.getItem(PREMIUM_PROMPTS_KEY);
    if (!stored) return true;
    
    const state: PremiumPromptState = JSON.parse(stored);
    
    // Check session limit (max 3 per session)
    if (state.count >= 3) {
      // Check if 30 min passed (new session)
      if (Date.now() - state.lastPromptTime > 30 * 60 * 1000) {
        return true;
      }
      return false;
    }
    
    return true;
  } catch (e) {
    return true;
  }
};

// Track "Maybe Later" dismissal
export const trackMaybeLater = (): void => {
  try {
    const stored = localStorage.getItem(MAYBE_LATER_KEY);
    const state: MaybeLaterState = stored 
      ? JSON.parse(stored) 
      : { count: 0, lastDismissTime: 0 };
    
    state.count++;
    state.lastDismissTime = Date.now();
    
    localStorage.setItem(MAYBE_LATER_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error tracking maybe later:", e);
  }
};

// Check if should suppress prompts (user dismissed 3+ times within 24h)
export const shouldSuppressPrompts = (): boolean => {
  try {
    const stored = localStorage.getItem(MAYBE_LATER_KEY);
    if (!stored) return false;
    
    const state: MaybeLaterState = JSON.parse(stored);
    
    // Reset after 24 hours
    if (Date.now() - state.lastDismissTime > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(MAYBE_LATER_KEY);
      return false;
    }
    
    return state.count >= 3;
  } catch (e) {
    return false;
  }
};

// Check if premium banner was dismissed
export const isPremiumBannerDismissed = (): boolean => {
  try {
    return localStorage.getItem(BANNER_DISMISSED_KEY) === "true";
  } catch (e) {
    return false;
  }
};

// Dismiss premium banner
export const dismissPremiumBanner = (): void => {
  try {
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  } catch (e) {
    console.error("Error dismissing premium banner:", e);
  }
};

// Navigate to premium page (placeholder)
export const navigateToPremium = (navigate: (path: string) => void): void => {
  // For now, show toast - in future, navigate to premium page
  navigate("/premium");
};
