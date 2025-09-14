// Token storage utilities for debugging and verification

export const TokenStorageUtils = {
  // Check if tokens exist in localStorage
  checkTokensInLocalStorage: () => {
    try {
      const persistData = localStorage.getItem('persist:root');
      if (!persistData) {
        console.log('❌ No Redux persist data found in localStorage');
        return { hasTokens: false, error: 'No persist data' };
      }

      const parsed = JSON.parse(persistData);
      if (!parsed.auth) {
        console.log('❌ No auth data in persist');
        return { hasTokens: false, error: 'No auth data' };
      }

      const authData = JSON.parse(parsed.auth);
      const hasAccessToken = !!authData.accessToken;
      const hasRefreshToken = !!authData.refreshToken;
      
      console.log('🔍 LocalStorage Token Check:', {
        accessToken: hasAccessToken ? 'Present ✅' : 'Missing ❌',
        refreshToken: hasRefreshToken ? 'Present ✅' : 'Missing ❌',
        isAuthenticated: authData.isAuthenticated,
        user: authData.user ? 'Present ✅' : 'Missing ❌'
      });

      return {
        hasTokens: hasAccessToken && hasRefreshToken,
        accessToken: hasAccessToken,
        refreshToken: hasRefreshToken,
        isAuthenticated: authData.isAuthenticated,
        authData
      };
    } catch (error) {
      console.error('❌ Error reading tokens from localStorage:', error);
      return { hasTokens: false, error: error.message };
    }
  },

  // Get tokens from localStorage (for debugging)
  getTokensFromLocalStorage: () => {
    const check = TokenStorageUtils.checkTokensInLocalStorage();
    if (check.hasTokens) {
      return {
        accessToken: check.authData.accessToken,
        refreshToken: check.authData.refreshToken
      };
    }
    return null;
  },

  // Force clear all auth data from localStorage
  clearAuthFromLocalStorage: () => {
    try {
      const persistData = localStorage.getItem('persist:root');
      if (persistData) {
        const parsed = JSON.parse(persistData);
        parsed.auth = JSON.stringify({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          accessToken: null,
          refreshToken: null
        });
        localStorage.setItem('persist:root', JSON.stringify(parsed));
        console.log('🗑️ Auth data cleared from localStorage');
      }
    } catch (error) {
      console.error('❌ Error clearing auth from localStorage:', error);
    }
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).TokenStorageUtils = TokenStorageUtils;
}