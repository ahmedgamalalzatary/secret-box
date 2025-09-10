// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Password Reset Types
export interface PasswordResetState {
  loading: boolean;
  error: string | null;
  success: boolean;
  emailSent: boolean;
  codeVerified: boolean;
  passwordReset: boolean;
}

// Email Verification Types
export interface EmailVerificationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  emailSent: boolean;
  verified: boolean;
}

// OTP Types
export interface OtpState {
  loading: boolean;
  error: string | null;
  success: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  remainingTime: number;
}

// Theme Types
export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  systemTheme: 'light' | 'dark';
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface UpdatePasswordRequest {
  token: string;
  password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Loading States
export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
}
