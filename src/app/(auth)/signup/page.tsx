'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthIndicator, usePasswordStrength } from '@/components/auth/PasswordStrengthIndicator';
import { UserPlus, Mail } from 'lucide-react';
import { cn } from '../../lib/utilstilstilstilstilstils';
import { useSignupMutation } from '@/store/api/apiSlice';
import { toast } from 'sonner';

interface FormData {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobile: string;
}

interface FormErrors {
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    mobile?: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const [signup, { isLoading }] = useSignupMutation();
    const [formData, setFormData] = useState<FormData>({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [acceptTerms, setAcceptTerms] = useState(false);

    const passwordStrength = usePasswordStrength(formData.password);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Username validation
        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        } else if (formData.userName.length < 3) {
            newErrors.userName = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

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

        // Mobile validation
        const mobileRegex = /^[+]?[\d\s-()]{10,}$/;
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number';
        }

        // Terms acceptance validation
        if (!acceptTerms) {
            // We'll show this error in the UI
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && acceptTerms;
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
            const response = await signup({
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.mobile, // API expects 'phone' not 'mobile'
            }).unwrap();
            
            console.log('Signup successful:', response);

            // Store email for email confirmation
            localStorage.setItem('confirmEmail', formData.email);
            
            toast.success('Account created successfully! Please check your email for verification.');

            // Redirect to confirm email page after successful registration
            router.push('/confirm-email');
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Handle different error types
            if (error?.status === 409) {
                setErrors({ email: 'Email already exists. Please use a different email or sign in.' });
                toast.error('Email already registered');
            } else if (error?.status === 400) {
                const errorMessage = error?.data?.message || error?.data?.error || 'Invalid registration data.';
                setErrors({ email: errorMessage });
                toast.error(errorMessage);
            } else {
                const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
                setErrors({ email: errorMessage });
                toast.error(errorMessage);
            }
        }
    };

    const handleGoogleSignUp = () => {
        // TODO: Implement Google OAuth
        console.log('Google sign up clicked');
    };

    const handleGuestSignUp = () => {
        // Guest signup redirects to search page
        router.push('/search');
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
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
                        <CardContent className="space-y-6">
                            {/* OAuth and Guest Options */}
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleGoogleSignUp}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Continue with Google
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleGuestSignUp}
                                >
                                    Continue as Guest
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Manual Registration Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <label htmlFor="userName" className="text-sm font-medium text-foreground">
                                        Username *
                                    </label>
                                    <Input
                                        id="userName"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.userName}
                                        onChange={(e) => handleInputChange('userName', e.target.value)}
                                        className={cn(errors.userName && 'border-red-500')}
                                        required
                                    />
                                    {errors.userName && (
                                        <p className="text-sm text-red-600">{errors.userName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={cn(errors.email && 'border-red-500')}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Mobile */}
                                <div className="space-y-2">
                                    <label htmlFor="mobile" className="text-sm font-medium text-foreground">
                                        Mobile Number *
                                    </label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobile}
                                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                                        className={cn(errors.mobile && 'border-red-500')}
                                        required
                                    />
                                    {errors.mobile && (
                                        <p className="text-sm text-red-600">{errors.mobile}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                                        Password *
                                    </label>
                                    <PasswordInput
                                        id="password"
                                        placeholder="Create a password"
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
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword}
                                        required
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Terms and Privacy */}
                                <div className="flex items-start space-x-3 bg-muted/50 p-3 rounded-lg">
                                    <Checkbox
                                        id="terms"
                                        checked={acceptTerms}
                                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                        className="mt-0.5"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                                        By creating an account, you agree to our{' '}
                                        <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                                    </label>
                                </div>
                                {!acceptTerms && (
                                    <p className="text-sm text-red-600">You must accept the terms and conditions</p>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !passwordStrength.isValid}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Button>

                                {/* Sign In Link */}
                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link href="/signin" className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="text-center">
                                    <Link href="/forget-password" className="text-sm text-primary hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}