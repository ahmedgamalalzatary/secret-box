'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/auth/OTPInput';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { useConfirmEmailMutation, useResendVerificationMutation } from '@/store/api/apiSlice';
import { toast } from 'sonner';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [confirmEmail, { isLoading }] = useConfirmEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('');

  // Get email from localStorage and setup timer
  useEffect(() => {
    const storedEmail = localStorage.getItem('confirmEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error('Session expired. Please sign up again.');
      router.push('/signup');
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
    if (error) setError('');
  };

  const handleOTPComplete = async (value: string) => {
    if (value.length === 6) {
      await handleVerifyOTP(value);
    }
  };

  const handleVerifyOTP = async (otpValue: string = otp) => {
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      setError('Session expired. Please sign up again.');
      router.push('/signup');
      return;
    }

    setError('');

    try {
      await confirmEmail({ email, OTP: otpValue }).unwrap();

      // Clear stored email
      localStorage.removeItem('confirmEmail');

      toast.success('Email verified successfully! You can now sign in.');

      // Redirect to signin page after successful verification
      router.push('/signin');
    } catch (error: unknown) {
      console.error('OTP verification error:', error);

      // Handle different error types
      if (error?.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
        toast.error('Invalid OTP');
      } else if (error?.status === 404) {
        setError('Account not found. Please sign up again.');
        toast.error('Account not found');
        router.push('/signup');
      } else if (error?.status === 409) {
        setError('Email already verified. You can sign in now.');
        toast.success('Email already verified');
        router.push('/signin');
      } else {
        const errorMessage = error?.data?.message || 'Verification failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleResendOTP = async () => {
    setError('');

    if (!email) {
      setError('Session expired. Please sign up again.');
      toast.error('Session expired');
      router.push('/signup');
      return;
    }

    try {
      await resendVerification({ email }).unwrap();

      // Reset timer and states
      setTimeLeft(300);
      setCanResend(false);
      setOtp('');

      toast.success('New verification code sent to your email!');
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);

      if (error?.status === 404) {
        setError('Account not found. Please sign up again.');
        toast.error('Account not found');
        router.push('/signup');
      } else if (error?.status === 409) {
        setError('Email already verified. You can sign in now.');
        toast.success('Email already verified');
        router.push('/signin');
      } else {
        const errorMessage = error?.data?.message || 'Failed to resend verification code.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerifyOTP();
  };

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
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Confirm Your Email</CardTitle>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a 6-digit verification code to your email address.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Check your inbox</p>
                  <p className="text-muted-foreground">
                    Enter the 6-digit code we sent to your email address.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block text-center">
                  Verification Code
                </label>
                <OTPInput
                  value={otp}
                  onChange={handleOTPChange}
                  onComplete={handleOTPComplete}
                  error={error}
                />
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">Code has expired</p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
              >
                {isResending ? 'Resending...' : 'Resend verification code'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already verified?{' '}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
