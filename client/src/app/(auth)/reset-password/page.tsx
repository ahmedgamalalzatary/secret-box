'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthIndicator, usePasswordStrength } from '@/components/auth/PasswordStrengthIndicator';
import { useResetPasswordMutation } from '@/store/api/apiSlice';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Get email and OTP from URL parameters or localStorage
  useEffect(() => {
    const emailParam = searchParams.get('email') || localStorage.getItem('resetEmail') || '';
    const otpParam = searchParams.get('otp') || localStorage.getItem('resetOTP') || '';

    setEmail(emailParam);
    setOtp(otpParam);

    // If no email or OTP, redirect to forgot password
    if (!emailParam || !otpParam) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/forget-password');
    }
  }, [searchParams, router]);

  const passwordStrength = usePasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time password confirmation validation
    if (field === 'confirmPassword' || field === 'password') {
      if (field === 'confirmPassword' && formData.password && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (field === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await resetPassword({
        email,
        OTP: otp,
        newPassword: formData.password,
      }).unwrap();

      // Clear stored reset data
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetOTP');

      setIsSuccess(true);
      toast.success('Password reset successfully!');

      // Redirect to signin page after successful reset
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } catch (error: unknown) {
      console.error('Reset password error:', error);

      // Handle different error types
      if (error?.status === 400) {
        toast.error('Invalid OTP or expired reset link. Please request a new password reset.');
        setErrors({ password: 'Invalid OTP or expired reset link.' });
        setTimeout(() => {
          router.push('/forget-password');
        }, 2000);
      } else if (error?.status === 404) {
        toast.error('User not found. Please check your email address.');
        setErrors({ password: 'User not found.' });
      } else {
        const errorMessage = error?.data?.message || 'Failed to reset password. Please try again.';
        toast.error(errorMessage);
        setErrors({ password: errorMessage });
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Theme toggle */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully reset.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  Redirecting to sign in page...
                </p>
              </div>
              <Button
                onClick={() => router.push('/signin')}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Theme toggle */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your new password to secure your account.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  New Password *
                </label>
                <PasswordInput
                  id="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password *
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements Info */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long, include at least 2 uppercase letters, no spaces, and at least 2 special characters (&@#(*$!@^($).
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isResetting || !passwordStrength.isValid}
              >
                {isResetting ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              {/* Sign In Link */}
              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
