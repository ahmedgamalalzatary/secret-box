import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export default function ForgetPasswordCodePage() {
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
            <CardTitle className="text-2xl font-bold">Enter OTP Code</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the one-time password sent to your email.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-foreground">
                  One-Time Password
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Code expires in <span className="font-medium text-foreground">05:00</span>
                </p>
                <Button variant="ghost" className="text-sm">
                  Resend OTP
                </Button>
                <div className="text-sm text-muted-foreground">
                  <a href="/forget-password" className="text-primary hover:underline">
                    Back to forgot password
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
