import { useEffect } from 'react';
import { toast } from 'sonner';

interface ApiError {
  status: number;
  data: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export function useApiError(error: unknown, isError: boolean) {
  useEffect(() => {
    if (isError && error) {
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
                onClick: () => window.location.href = '/signin',
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
                  onClick: () => window.location.reload(),
                },
              });
            } else {
              toast.error('Unexpected Error', {
                description: data?.message || 'An unexpected error occurred',
              });
            }
        }
      };

      // Check if error has the expected structure
      if (error && typeof error === 'object' && 'status' in error) {
        handleApiError(error as ApiError);
      } else {
        // Handle other types of errors
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message: string }).message 
          : 'An unexpected error occurred';
        
        toast.error('Error', {
          description: errorMessage,
        });
      }
    }
  }, [error, isError]);
}