import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
  UpdatePasswordRequest,
  ResendVerificationRequest,
} from '@/types/types';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: '/api', // Adjust this to your API base URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
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
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Password reset endpoints
    requestPasswordReset: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    verifyResetCode: builder.mutation<{ message: string; token: string }, VerifyCodeRequest>({
      query: (data) => ({
        url: '/auth/verify-reset-code',
        method: 'POST',
        body: data,
      }),
    }),

    updatePassword: builder.mutation<{ message: string }, UpdatePasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Email verification endpoints
    resendVerification: builder.mutation<{ message: string }, ResendVerificationRequest>({
      query: (data) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // User endpoints
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useVerifyResetCodeMutation,
  useUpdatePasswordMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = apiSlice;