import { RootState } from '../store';

// Auth Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token;

// App Selectors
export const selectApp = (state: RootState) => state.app;
export const selectTheme = (state: RootState) => state.app.theme;
export const selectSidebarCollapsed = (state: RootState) => state.app.sidebarCollapsed;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectNotifications = (state: RootState) => state.app.notifications;
export const selectLastActivity = (state: RootState) => state.app.lastActivity;

// Combined Selectors
export const selectUserInfo = (state: RootState) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export const selectAppState = (state: RootState) => ({
  theme: state.app.theme,
  sidebarCollapsed: state.app.sidebarCollapsed,
  loading: state.app.loading,
  notifications: state.app.notifications,
});
