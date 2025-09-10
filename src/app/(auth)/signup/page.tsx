import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { ErrorSystemTest } from '@/components/test/tmp_rovodev_ErrorSystemTest';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-4">
            {/* Error System Tests - Temporary */}
            <ErrorSystemTest />
            
            {/* Original Signup Form */}
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    {/* Theme toggle */}
                    <div className="flex justify-end">
                        <ThemeToggle />
                    </div>
                    
                    <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Sign up to get started with your account
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground">
                                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <a href="/signin" className="text-primary hover:underline">
                                    Sign in
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
}