import { toast } from "@/hooks/use-toast";

const STORAGE_PREFIX = "nudgeme_";

interface StorageResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Storage read error for ${key}:`, error);
    if ((error as Error).name === "SecurityError") {
      toast({
        title: "Storage disabled in private mode",
        description: "Some features may not work correctly.",
        duration: 3000,
      });
    }
    return defaultValue;
  }
};

export const safeSetItem = <T>(key: string, value: T): StorageResult<T> => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return { success: true, data: value };
  } catch (error) {
    console.error(`Storage write error for ${key}:`, error);
    
    if ((error as Error).name === "QuotaExceededError") {
      toast({
        title: "Storage full",
        description: "Please delete some saved quotes in Settings.",
        variant: "destructive",
        duration: 4000,
      });
    } else if ((error as Error).name === "SecurityError") {
      toast({
        title: "Saving disabled in private mode",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Could not save",
        description: "Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
    
    return { success: false, data: null, error: (error as Error).message };
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch (error) {
    console.error(`Storage remove error for ${key}:`, error);
    return false;
  }
};

// Keys without prefix for backward compatibility
export const STORAGE_KEYS = {
  SAVED_QUOTES: "saved_quotes",
  SETTINGS: "settings",
} as const;
