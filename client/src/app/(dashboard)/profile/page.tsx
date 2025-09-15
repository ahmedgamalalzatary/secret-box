'use client';

import { useGetCurrentUserQuery, useLogoutMutation } from '@/store/api/apiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Shield, Edit, Settings, LogOut } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ComponentErrorBoundary } from '@/components/error-boundary';

export default function ProfilePage() {
  const { data: profileData, isLoading, error } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Extract user from backend response structure
  const user = profileData?.user;

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint with correct flag structure
      await logout({ flag: 'logout' }).unwrap();
      
      // Clear credentials from Redux store
      dispatch(clearCredentials());
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to signin page
      router.push('/signin');
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails on backend, clear local credentials
      dispatch(clearCredentials());
      toast.error('Logout completed (with warning)');
      router.push('/signin');
    }
  };

  if (isLoading) {
    return (
      <ComponentErrorBoundary>
        <div className="min-h-screen bg-background">
          {/* Theme Toggle - Top Right */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Skeleton */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="text-center pb-6">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-8 w-64 mx-auto mb-2" />
                  <Skeleton className="h-5 w-32 mx-auto" />
                </CardHeader>
              </Card>
              
              {/* Content Skeleton */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
                
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ComponentErrorBoundary>
    );
  }

  if (error) {
    return (
      <ComponentErrorBoundary>
        <div className="min-h-screen bg-background flex items-center justify-center">
          {/* Theme Toggle - Top Right */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          <Card className="max-w-md mx-auto border-border/50 shadow-sm">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to fetch your profile information. Please try again.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/signin')} variant="default">
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ComponentErrorBoundary>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'user':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <ComponentErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Theme Toggle - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="text-center pb-6">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-background shadow-lg">
                  <AvatarImage 
                    src={user?.picture?.secure_url} 
                    alt={user?.userName || 'User Avatar'} 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                    {user ? getInitials(user.firstName, user.lastName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
              </div>
              
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                {user?.userName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown User'}
              </CardTitle>
              
              <div className="flex items-center justify-center gap-2">
                <Badge className={getRoleColor(user?.role || 'user')}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role || 'User'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Content */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Personal Information */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-base font-semibold text-foreground">{user?.email || 'Not provided'}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-base font-semibold text-foreground">
                      {user?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => toast.info('Edit profile feature coming soon!')}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => toast.info('Account settings coming soon!')}
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>

                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-3 h-12"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p className="text-base text-foreground">{user?.firstName || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p className="text-base text-foreground">{user?.lastName || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-base text-foreground font-mono">{user?._id || 'Unknown'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-base text-foreground capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
}