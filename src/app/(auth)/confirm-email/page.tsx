import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

export default function ConfirmEmailPage() {
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
                            We&apos;ve sent a confirmation OTP to your email address.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground">Check your inbox</p>
                                    <p className="text-muted-foreground">
                                        Click the confirmation link in the email we sent you.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full">
                                Resend confirmation email
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already confirmed?{' '}
                                <a href="/signin" className="text-primary hover:underline">
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
