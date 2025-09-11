'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PasswordStrength, PasswordRequirement } from '@/types/types';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const passwordStrength = useMemo((): PasswordStrength => {
    const requirements: PasswordRequirement[] = [
      {
        id: 'length',
        label: 'At least 8 characters',
        test: (pwd) => pwd.length >= 8,
        met: false,
      },
      {
        id: 'uppercase',
        label: 'At least 2 uppercase letters',
        test: (pwd) => (pwd.match(/[A-Z]/g) || []).length >= 2,
        met: false,
      },
      {
        id: 'noSpaces',
        label: 'No spaces allowed',
        test: (pwd) => !/\s/.test(pwd),
        met: false,
      },
      {
        id: 'specialChars',
        label: 'At least 2 special characters (&@#(*$!@^($)',
        test: (pwd) => (pwd.match(/[&@#(*$!@^($]/g) || []).length >= 2,
        met: false,
      },
    ];

    // Test each requirement
    requirements.forEach((req) => {
      req.met = req.test(password);
    });

    const metCount = requirements.filter((req) => req.met).length;
    const score = (metCount / requirements.length) * 100;
    const isValid = metCount === requirements.length;

    return {
      score,
      requirements,
      isValid,
    };
  }, [password]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-gray-200';
    if (score < 50) return 'bg-red-500';
    if (score < 75) return 'bg-yellow-500';
    if (score < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter password';
    if (score < 50) return 'Weak';
    if (score < 75) return 'Fair';
    if (score < 100) return 'Good';
    return 'Strong';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Password Strength</span>
          <Badge variant={
            passwordStrength.score === 0 ? 'secondary' :
            passwordStrength.score < 50 ? 'destructive' :
            passwordStrength.score < 75 ? 'outline' :
            passwordStrength.score < 100 ? 'default' : 'default'
          } className={cn(
            passwordStrength.score === 100 && 'bg-green-600 hover:bg-green-600/80'
          )}>
            {getStrengthText(passwordStrength.score)}
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getStrengthColor(passwordStrength.score)
            )}
            style={{ width: `${passwordStrength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Password Requirements:</span>
        <ul className="space-y-1">
          {passwordStrength.requirements.map((requirement) => (
            <li key={requirement.id} className="flex items-center space-x-2 text-sm">
              {requirement.met ? (
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              <span className={cn(
                requirement.met ? 'text-green-600' : 'text-muted-foreground'
              )}>
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Hook to get password strength
export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo((): PasswordStrength => {
    const requirements: PasswordRequirement[] = [
      {
        id: 'length',
        label: 'At least 8 characters',
        test: (pwd) => pwd.length >= 8,
        met: false,
      },
      {
        id: 'uppercase',
        label: 'At least 2 uppercase letters',
        test: (pwd) => (pwd.match(/[A-Z]/g) || []).length >= 2,
        met: false,
      },
      {
        id: 'noSpaces',
        label: 'No spaces allowed',
        test: (pwd) => !/\s/.test(pwd),
        met: false,
      },
      {
        id: 'specialChars',
        label: 'At least 2 special characters (&@#(*$!@^($)',
        test: (pwd) => (pwd.match(/[&@#(*$!@^($]/g) || []).length >= 2,
        met: false,
      },
    ];

    // Test each requirement
    requirements.forEach((req) => {
      req.met = req.test(password);
    });

    const metCount = requirements.filter((req) => req.met).length;
    const score = (metCount / requirements.length) * 100;
    const isValid = metCount === requirements.length;

    return {
      score,
      requirements,
      isValid,
    };
  }, [password]);
}