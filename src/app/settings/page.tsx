
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, Lock, LogOut, Sun, Moon, Laptop, Palette, User, Trash2, Shield, Info, Send, FileText, ChevronRight } from 'lucide-react';
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, type User as FirebaseUser } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type AnalysisResult, type ComparisonHistoryItem } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
<<<<<<< HEAD
import { cn } from '@/lib/utils';
=======
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

>>>>>>> 309dde7 (Under the settings page I want the contact features to be there, legal e)

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
});

<<<<<<< HEAD
const SettingsItem = ({ icon: Icon, label, href, onClick, className }: { icon: React.ElementType, label: string, href?: string, onClick?: () => void, className?: string }) => {
=======
const SettingsItem = ({ icon: Icon, label, href, onClick }: { icon: React.ElementType, label: string, href?: string, onClick?: () => void }) => {
>>>>>>> 309dde7 (Under the settings page I want the contact features to be there, legal e)
    const content = (
        <div className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer w-full">
            <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
    );

    if (href) {
<<<<<<< HEAD
        return <Link href={href} className={className}>{content}</Link>;
    }
    
    return <button onClick={onClick} className={cn("w-full text-left", className)}>{content}</button>;
=======
        return <Link href={href}>{content}</Link>;
    }
    
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
>>>>>>> 309dde7 (Under the settings page I want the contact features to be there, legal e)
};

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const auth = getAuth(app);
  const isMobile = useIsMobile();
  
  const [, setAnalysisHistory] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [, setComparisonHistory] = useLocalStorage<ComparisonHistoryItem[]>('webintel_comparison_history', []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true);
  }, []);

  const clearAllHistory = () => {
    setAnalysisHistory([]);
    setComparisonHistory([]);
    toast({
        title: 'History Cleared',
        description: 'All your analysis and comparison history has been removed from this device.'
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    if (!user || !user.email) return;

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        router.push('/');
    } catch (error: any) {
        toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  }
<<<<<<< HEAD

  if (!mounted) {
      return (
          <div className="container mx-auto px-4 py-8 max-w-3xl space-y-10 pb-24 md:pb-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
      )
  }
  
  return (
        <div className="container mx-auto px-4 py-8 max-w-3xl pb-24 md:pb-8">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and application preferences.</p>
          </div>
          <div className="space-y-10">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Palette /> Appearance</CardTitle>
                    <CardDescription>Customise the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!mounted ? (
                      <Skeleton className="h-24 w-full" />
                  ) : (
                    <RadioGroup
                        value={theme}
                        onValueChange={setTheme}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="light" id="light" className="sr-only" />
                            <Sun className="h-10 w-10" />
                            <span className="font-semibold">Light</span>
                        </Label>
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="dark" id="dark" className="sr-only" />
                            <Moon className="h-10 w-10" />
                            <span className="font-semibold">Dark</span>
                        </Label>
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="system" id="system" className="sr-only" />
                            <Laptop className="h-10 w-10" />
                            <span className="font-semibold">System</span>
                        </Label>
                    </RadioGroup>
                  )}
                </CardContent>
            </Card>
            
            {isAuthLoading ? (
                <Skeleton className="h-64 w-full" />
            ) : user ? (
                <>
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3"><User /> Account</CardTitle>
                        <CardDescription>Manage your account details. You are currently logged in as {user.email}.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                      <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        {...field}
                                        className="pl-10"
                                        placeholder="Enter your current password"
                                      />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                      <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        {...field}
                                        className="pl-10"
                                        placeholder="Enter your new password"
                                      />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                      {showNewPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-center justify-between">
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                                 <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <LogOut className="mr-2" /> Logout
                                </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                </>
            ) : (
                <Card className="glass-card text-center">
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Log in or sign up to manage your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Log In / Sign Up</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-muted-foreground px-4">Support & Legal</h3>
                 <div className="space-y-1">
                    <SettingsItem icon={Info} label="About WebIntel" href="/about" className="md:hidden"/>
                    <SettingsItem icon={Send} label="Contact Us" href="/contact" className="md:hidden"/>
                    <SettingsItem icon={Shield} label="Privacy Policy" href="/privacy" />
                    <SettingsItem icon={FileText} label="Terms & Conditions" href="/terms" />
                 </div>
            </div>
=======
  
  const MobileSettings = () => {
      return (
        <div className="p-4 space-y-8 pb-20">
            <h1 className="text-4xl font-bold">Settings</h1>
            {isAuthLoading ? (
                 <Skeleton className="h-40 w-full" />
            ): user && (
                 <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</h2>
                    <div className="rounded-lg bg-card border overflow-hidden">
                        <div className="p-4 border-b">
                            <p className="font-semibold">{user.displayName || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <SettingsItem icon={Lock} label="Change Password" onClick={() => toast({ title: "Please use desktop view to change password." })} />
                        <SettingsItem icon={LogOut} label="Sign Out" onClick={handleLogout} />
                    </div>
                 </div>
            )}
            
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Legal & Support</h2>
                <div className="rounded-lg bg-card border overflow-hidden">
                    <SettingsItem icon={Info} label="About WebIntel" href="/about" />
                    <SettingsItem icon={Send} label="Contact Us" href="/contact" />
                    <SettingsItem icon={Shield} label="Privacy Policy" href="/privacy" />
                    <SettingsItem icon={FileText} label="Terms & Conditions" href="/terms" />
                </div>
            </div>

            <div>
                 <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Appearance</h2>
                <div className="rounded-lg bg-card border p-4">
                     <RadioGroup
                        value={theme}
                        onValueChange={setTheme}
                        className="grid grid-cols-3 gap-2"
                    >
                        <Label className="p-3 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="light" id="light_mobile" className="sr-only" />
                            <Sun className="h-6 w-6" />
                            <span className="text-xs font-semibold">Light</span>
                        </Label>
                        <Label className="p-3 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="dark" id="dark_mobile" className="sr-only" />
                            <Moon className="h-6 w-6" />
                            <span className="text-xs font-semibold">Dark</span>
                        </Label>
                        <Label className="p-3 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="system" id="system_mobile" className="sr-only" />
                            <Laptop className="h-6 w-6" />
                            <span className="text-xs font-semibold">System</span>
                        </Label>
                    </RadioGroup>
                </div>
            </div>

             <div>
                 <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Danger Zone</h2>
                <div className="rounded-lg bg-card border overflow-hidden">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <button className="w-full text-left">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer w-full">
                                <div className="flex items-center gap-4">
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                    <span className="font-medium text-destructive">Clear All Local History</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your entire analysis and comparison history from this browser. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllHistory} className={buttonVariants({ variant: "destructive" })}>Clear History</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
      )
  }

  const DesktopSettings = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and application preferences.</p>
          </div>
          <div className="space-y-10">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Palette /> Appearance</CardTitle>
                    <CardDescription>Customise the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!mounted ? (
                      <Skeleton className="h-24 w-full" />
                  ) : (
                    <RadioGroup
                        value={theme}
                        onValueChange={setTheme}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="light" id="light" className="sr-only" />
                            <Sun className="h-10 w-10" />
                            <span className="font-semibold">Light</span>
                        </Label>
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="dark" id="dark" className="sr-only" />
                            <Moon className="h-10 w-10" />
                            <span className="font-semibold">Dark</span>
                        </Label>
                        <Label className="p-4 border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                            <RadioGroupItem value="system" id="system" className="sr-only" />
                            <Laptop className="h-10 w-10" />
                            <span className="font-semibold">System</span>
                        </Label>
                    </RadioGroup>
                  )}
                </CardContent>
            </Card>
            
            {isAuthLoading ? (
                <Skeleton className="h-64 w-full" />
            ) : user ? (
                <>
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3"><User /> Account</CardTitle>
                        <CardDescription>Manage your account details. You are currently logged in as {user.email}.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                      <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        {...field}
                                        className="pl-10"
                                        placeholder="Enter your current password"
                                      />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <FormControl>
                                      <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        {...field}
                                        className="pl-10"
                                        placeholder="Enter your new password"
                                      />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                      {showNewPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-center justify-between">
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                                <Button variant="outline" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                </>
            ) : (
                <Card className="glass-card text-center">
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Log in or sign up to manage your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Log In / Sign Up</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
>>>>>>> 309dde7 (Under the settings page I want the contact features to be there, legal e)
            
            <Card className="glass-card border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-destructive"><Trash2 /> Danger Zone</CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                            variant="destructive"
                        >
                            Clear All Local History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your entire analysis and comparison history from this browser. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllHistory} className={buttonVariants({ variant: "destructive" })}>Clear History</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
          </div>
        </div>
      );
<<<<<<< HEAD
=======
  }

  if (!mounted) {
      return (
          <div className="container mx-auto px-4 py-8 max-w-3xl space-y-10">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
      )
  }
  
  return isMobile ? <MobileSettings /> : <DesktopSettings />;
>>>>>>> 309dde7 (Under the settings page I want the contact features to be there, legal e)
}
