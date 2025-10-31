<<<<<<< HEAD
<<<<<<< HEAD

'use client';
import { useState, useEffect } from 'react';
<<<<<<< HEAD
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.847 6.033l-1.072 3.916 3.92-1.066z"/></svg>
                    </div>
                    <CardTitle>Direct Support via WhatsApp</CardTitle>
                    <CardDescription>For the fastest response, reach out on WhatsApp for real-time assistance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.847 6.033l-1.072 3.916 3.92-1.066z"/></svg>
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

=======
=======

>>>>>>> 0a798ff (Also about the back buttons the go back to the previous page not home pl)
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
=======
>>>>>>> 994d8a3 (Please add a support feature like the "Support" should be linked to my W)
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
<<<<<<< HEAD
>>>>>>> 512e4b0 (Please creat a contact page with like a features that allow users to inp)
=======
      
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

>>>>>>> c04aa6b (For that contact page let that WhatsApp stuff not be the only option. Br)
    </div>
  );
}
