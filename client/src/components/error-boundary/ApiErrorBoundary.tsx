'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ApiError {
  status: number;
  data: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
}

export function ApiErrorBoundary({ children }: ApiErrorBoundaryProps) {
  const router = useRouter();
  
  // Global error handler for API errors
  useEffect(() => {
    const handleApiError = (error: ApiError) => {
      const { status, data } = error;
      
      // Handle different types of API errors
      switch (status) {
        case 400:
          toast.error('Bad Request', {
            description: data.message || 'Invalid request data',
          });
          break;
        
        case 401:
          toast.error('Authentication Required', {
            description: 'Please sign in to continue',
            action: {
              label: 'Sign In',
              onClick: () => router.push('/signin'),
            },
          });
          break;
        
        case 403:
          toast.error('Access Denied', {
            description: 'You don\'t have permission to perform this action',
          });
          break;
        
        case 404:
          toast.error('Not Found', {
            description: 'The requested resource was not found',
          });
          break;
        
        case 422:
          toast.error('Validation Error', {
            description: data.message || 'Please check your input and try again',
          });
          break;
        
        case 429:
          toast.error('Too Many Requests', {
            description: 'Please wait a moment before trying again',
          });
          break;
        
        case 500:
          toast.error('Server Error', {
            description: 'Something went wrong on our end. Please try again later.',
          });
          break;
        
        case 502:
        case 503:
        case 504:
          toast.error('Service Unavailable', {
            description: 'The service is temporarily unavailable. Please try again later.',
          });
          break;
        
        default:
          // Network errors or other unexpected errors
          if (status === 0 || !status) {
            toast.error('Network Error', {
              description: 'Please check your internet connection and try again',
              action: {
                label: 'Retry',
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                },
              },
            });
          } else {
            toast.error('Unexpected Error', {
              description: data.message || 'An unexpected error occurred',
            });
          }
      }
    };

    // Store the error handler globally for use by RTK Query hooks
    (window as unknown as Record<string, unknown>).__apiErrorHandler = handleApiError;

    return () => {
      delete (window as unknown as Record<string, unknown>).__apiErrorHandler;
    };
  }, [router]);

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Connection Restored', {
        description: 'You\'re back online!',
      });
    };

    const handleOffline = () => {
      toast.error('Connection Lost', {
        description: 'You\'re currently offline. Some features may not work.',
        duration: Infinity,
        id: 'offline-toast',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection status
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      toast.dismiss('offline-toast');
    };
  }, []);

  return <>{children}</>;
}

// Hook for manual API error handling
export function useApiErrorHandler() {
  const router = useRouter();
  
  const handleError = (error: unknown) => {
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as ApiError;
      
      // Handle specific error cases
      switch (apiError.status) {
        case 401:
          toast.error('Session Expired', {
            description: 'Please sign in again',
            action: {
              label: 'Sign In',
              onClick: () => router.push('/signin'),
            },
          });
          break;
        
        default:
          toast.error('Error', {
            description: apiError.data?.message || 'An error occurred',
          });
      }
    } else {
      toast.error('Error', {
        description: 'An unexpected error occurred',
      });
    }
  };

  return { handleError };
}