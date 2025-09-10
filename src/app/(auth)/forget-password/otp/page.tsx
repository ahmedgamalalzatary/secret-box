'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/auth/OTPInput';
import { Smartphone, Clock } from 'lucide-react';
import { useVerifyForgetPasswordMutation, useForgetPasswordMutation } from '@/store/api/apiSlice';
import { toast } from 'sonner';

export default function ForgetPasswordCodePage() {
  const router = useRouter();
  const [verifyForgetPassword, { isLoading }] = useVerifyForgetPasswordMutation();
  const [forgetPassword, { isLoading: isResending }] = useForgetPasswordMutation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);

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

    setError('');

    try {
      // Get email from localStorage (stored from forget-password page)
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setError('Session expired. Please start the password reset process again.');
        toast.error('Session expired');
        router.push('/forget-password');
        return;
      }

      await verifyForgetPassword({ email, OTP: otpValue }).unwrap();
      
      // Store OTP for reset password page
      localStorage.setItem('resetOTP', otpValue);
      
      toast.success('OTP verified successfully!');
      
      // Redirect to reset password page after successful verification
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpValue)}`);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      // Handle different error types
      if (error?.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
        toast.error('Invalid OTP');
      } else if (error?.status === 404) {
        setError('Email not found. Please restart the password reset process.');
        toast.error('Email not found');
        router.push('/forget-password');
      } else {
        setError('Verification failed. Please try again.');
        toast.error('Verification failed');
      }
    }
  };

  const handleResendOTP = async () => {
    setError('');

    try {
      // Get email from localStorage
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setError('Session expired. Please start the password reset process again.');
        toast.error('Session expired');
        router.push('/forget-password');
        return;
      }

      await forgetPassword({ email }).unwrap();
      
      // Reset timer and states
      setTimeLeft(120);
      setCanResend(false);
      setOtp('');
      
      toast.success('New verification code sent!');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      
      if (error?.status === 404) {
        setError('Email not found. Please restart the password reset process.');
        toast.error('Email not found');
        router.push('/forget-password');
      } else {
        setError('Failed to resend OTP. Please try again.');
        toast.error('Failed to resend code');
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
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Enter Verification Code</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email to reset your password.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>

            {/* Resend and Navigation */}
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
                <Link href="/forget-password" className="text-primary hover:underline">
                  Back to forgot password
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
