
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft, User, Mail, AtSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthContext } from '@/firebase/provider';
import type { User as FirebaseUser } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactPage() {
  const router = useRouter();
  const auth = useAuthContext();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      if (auth) {
          const unsubscribe = useAuth((currentUser) => {
              setUser(currentUser);
              setIsLoading(false);
          });
          return () => unsubscribe();
      } else {
          setIsLoading(false);
      }
  }, [auth]);


  const handleWhatsAppClick = () => {
    const name = user?.displayName || 'N/A';
    const email = user?.email || 'N/A';

    const subject = "Support Request from WebIntel";
    const body = `
Hello Fortune,

I am contacting you from WebIntel regarding an issue or query.

*User Details:*
- *Name:* ${name}
- *Email:* ${email}

*Please describe your issue below:*
---------------------------------


`;
    const mailtoLink = `https://wa.me/2349167689200?text=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleEmailClick = () => {
    const name = user?.displayName || 'N/A';
    const email = user?.email || 'N/A';

    const subject = "Support Request from WebIntel";
    const body = `
Hello Fortune,

I am contacting you from WebIntel regarding an issue or query.

User Details:
- Name: ${name}
- Email: ${email}

Please describe your issue below:
---------------------------------


`;
    const mailtoLink = `mailto:fortune.esho@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-12 pb-24 md:pb-8">
      <div className="mb-8">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-4">
        <Send className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">Contact Support</h1>
        <p className="text-lg text-muted-foreground">Need help or have a question? I'm here for you.</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-foreground text-center">Your Information:</h4>
        {isLoading ? (
            <div className="space-y-3 flex flex-col items-center">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-64" />
            </div>
        ) : user ? (
            <div className="space-y-2 text-sm flex flex-col items-center">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user.displayName || 'Not Provided'}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user.email}</span>
                </div>
            </div>
        ) : (
            <p className="text-sm text-muted-foreground text-center">Log in to pre-fill your contact details.</p>
        )}
    </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Direct Support via WhatsApp</CardTitle>
          <CardDescription>For the fastest response, you can contact me directly on WhatsApp. Your user details will be pre-filled in the message.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleWhatsAppClick} className="w-full" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                Contact on WhatsApp
            </Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Support via Email</CardTitle>
          <CardDescription>Alternatively, you can send an email. I'll get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleEmailClick} className="w-full" variant="secondary" disabled={isLoading}>
                <AtSign className="mr-2 h-4 w-4" />
                Send an Email
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
