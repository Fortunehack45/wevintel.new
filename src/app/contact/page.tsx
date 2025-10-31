
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft, User, Mail, AtSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthContext } from '@/firebase/provider';
import type { User as FirebaseUser } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

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
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12 pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        className="text-center space-y-4"
      >
        <div className="inline-block bg-primary/10 p-4 rounded-full">
            <Send className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have a question, feedback, or need support? I'm here to help you with anything you need.</p>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle>Your Information</CardTitle>
                <CardDescription>This will be included in your support message.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3 flex flex-col items-center">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                ) : user ? (
                    <div className="space-y-2 text-sm flex flex-col items-center">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{user.displayName || 'Not Provided'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{user.email}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center">Log in to pre-fill your contact details.</p>
                )}
            </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card h-full group hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                    <div className="inline-block bg-green-500/10 p-3 rounded-full mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10c1.74 0 3.38-.45 4.78-1.25l-1.4-1.4A7.94 7.94 0 0 1 12 20a8 8 0 0 1-8-8c0-4.42 3.58-8 8-8c2.21 0 4.21.9 5.66 2.34l-2.16 2.16h6V4.94zM16.5 11.5c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5s.5.22.5.5V11h3.5c.28 0 .5.22.5.5z"/></svg>
                    </div>
                    <CardTitle>Direct Support via WhatsApp</CardTitle>
                    <CardDescription>For the fastest response, reach out on WhatsApp for real-time assistance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                        <Send className="mr-2 h-4 w-4" />
                        Contact on WhatsApp
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass-card h-full group hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                    <div className="inline-block bg-primary/10 p-3 rounded-full mx-auto mb-4">
                        <AtSign className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle>Support via Email</CardTitle>
                    <CardDescription>Alternatively, send an email and I'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleEmailClick} className="w-full" variant="secondary" disabled={isLoading}>
                        <AtSign className="mr-2 h-4 w-4" />
                        Send an Email
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
      </div>

    </div>
  );
}
