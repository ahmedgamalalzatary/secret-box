import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function ResetPasswordPage() {
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
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    New Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                                </p>
                            </div>
                            <Button type="submit" className="w-full">
                                Reset Password
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
