/**
 * Safe LocalStorage Utility
 * Prevents QuotaExceededError crashes and gracefully manages browser storage limits.
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (e: any) {
      // Check for QuotaExceededError
      const isQuotaError = 
        e instanceof DOMException &&
        (e.code === 22 ||
         e.code === 1014 ||
         e.name === 'QuotaExceededError' ||
         e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
         (typeof e.message === 'string' && e.message.toLowerCase().includes('quota')));

      if (isQuotaError) {
        try {
          // Attempt to free up storage by clearing non-critical caches
          window.localStorage.removeItem('maison_cart');
          window.localStorage.removeItem('maison_boutique_orders');
          
          // Retry setting the critical item once
          window.localStorage.setItem(key, value);
          return true;
        } catch {
          // If still exceeding, fail silently and keep in memory state
          return false;
        }
      }
      return false;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
  }
};
