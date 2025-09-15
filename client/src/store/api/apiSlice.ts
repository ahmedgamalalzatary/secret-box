import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type {
  User,
  AuthResponse,
  LoginResponse,
  RefreshTokenResponse,
  SignupResponse,
  LoginRequest,
  RegisterRequest,
  ForgetPasswordRequest,
  VerifyForgetPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ResendVerificationRequest,
} from '@/types/types';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    signup: builder.mutation<SignupResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    signupWithGmail: builder.mutation<AuthResponse, { idToken: string }>({
      query: (data) => ({
        url: '/auth/signup/gmail',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, { flag?: 'fromAll' | 'logout' }>({
      query: (data = {}) => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Password reset endpoints
    forgetPassword: builder.mutation<void, ForgetPasswordRequest>({
      query: (data) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body: data,
      }),
    }),

    verifyForgetPassword: builder.mutation<void, VerifyForgetPasswordRequest>({
      query: (data) => ({
        url: '/auth/verify-forget-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Change password endpoint
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Email verification endpoints
    resendVerification: builder.mutation<{ message: string }, ResendVerificationRequest>({
      query: (data) => ({
        url: '/auth/re-send-confirm/email',
        method: 'POST',
        body: data,
      }),
    }),

    confirmEmail: builder.mutation<void, { email: string; OTP: string }>({
      query: (data) => ({
        url: '/auth/confirm/email',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // User endpoints
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/update-basic-info',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useSignupMutation,
  useSignupWithGmailMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgetPasswordMutation,
  useVerifyForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendVerificationMutation,
  useConfirmEmailMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = apiSlice;