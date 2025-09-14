import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types/types';
import { apiSlice } from '../api/apiSlice';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual auth actions
    setCredentials: (state, action: PayloadAction<{ user?: User; accessToken: string; refreshToken: string }>) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(apiSlice.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { _id: string, credentials: { access_token, refresh_token } }
        state.accessToken = action.payload.credentials.access_token;
        state.refreshToken = action.payload.credentials.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
        // Note: User data needs to be fetched separately via getCurrentUser
      })
      .addMatcher(apiSlice.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });

    // Signup - only stores email for verification, no tokens
    builder
      .addMatcher(apiSlice.endpoints.signup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiSlice.endpoints.signup.matchFulfilled, (state) => {
        state.loading = false;
        // Signup doesn't return tokens, user needs to verify email first
        state.error = null;
      })
      .addMatcher(apiSlice.endpoints.signup.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Google Signup - returns tokens immediately
    builder
      .addMatcher(apiSlice.endpoints.signupWithGmail.matchFulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
        // User data needs to be fetched separately
      });

    // Refresh Token
    builder
      .addMatcher(apiSlice.endpoints.refreshToken.matchFulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.error = null;
      });

    // Logout
    builder
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      });

    // Get current user
    builder
      .addMatcher(apiSlice.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addMatcher(apiSlice.endpoints.getCurrentUser.matchRejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  setCredentials,
  clearCredentials,
  setError,
  clearError,
  setLoading,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;