import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';

export default function ForgetPasswordPage() {
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
                            <KeyRound className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Enter your email address and we&apos;ll send you a reset link.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Reset Link
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <a href="/signin" className="text-primary hover:underline">
                                    Sign in
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
