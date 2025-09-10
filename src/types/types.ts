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

// Redux Store Types
export interface RootState {
  auth: AuthState;
  theme: ThemeState;
  api: Record<string, unknown>; // RTK Query API slice
}

// RTK Query Base Types
export interface BaseQueryError {
  status: number;
  data: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export interface MutationResponse<T = Record<string, unknown>> {
  data?: T;
  error?: BaseQueryError;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

// Password validation types
export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export interface PasswordStrength {
  score: number;
  requirements: PasswordRequirement[];
  isValid: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Password reset flow types (matching SecretBox API)
export interface ForgetPasswordRequest {
  email: string;
}

export interface VerifyForgetPasswordRequest {
  email: string;
  OTP: string;
}

export interface ResetPasswordRequest {
  email: string;
  OTP: string;
  newPassword: string;
}

// Change password type
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  flag: 'stayLoggedIn' | 'fromAll' | 'logout';
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
