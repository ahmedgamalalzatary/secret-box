import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignIn() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Theme toggle */}
                <div className="flex justify-end">
                    <ThemeToggle />
                </div>
                
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <a href="/forget-password" className="text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <a href="/signup" className="text-primary hover:underline">
                                    Sign up
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}