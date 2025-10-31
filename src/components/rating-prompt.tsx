
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRatingPrompt } from '@/hooks/use-rating-prompt';
import { StarRating } from './ui/star-rating';
import { Send, Sparkles } from 'lucide-react';
import { useAuth, useAuthContext } from '@/firebase/provider';
import { User as FirebaseUser } from 'firebase/auth';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name.' }),
  occupation: z.string().min(2, { message: 'Please enter your occupation.' }),
  rating: z.number().min(1, { message: 'Please provide a rating.' }),
  reason: z.string().min(10, { message: 'Please provide a reason with at least 10 characters.' }),
});

export function RatingPrompt() {
  const { isVisible, dismiss, submit } = useRatingPrompt();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const auth = useAuthContext();
  
  useEffect(() => {
    if (auth) {
      const unsubscribe = useAuth(setUser);
      return () => unsubscribe();
    }
  }, [auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
      occupation: '',
      rating: 0,
      reason: '',
    },
  });
  
   useEffect(() => {
    if (user && !form.getValues('name')) {
      form.setValue('name', user.displayName || '');
    }
  }, [user, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const message = `
*WebIntel Platform Review* 🌟

*Name:* ${values.name}
*Occupation:* ${values.occupation}
*Rating:* ${'⭐'.repeat(values.rating)}${'☆'.repeat(5 - values.rating)} (${values.rating}/5)

*Feedback:*
-----------------
${values.reason}
-----------------

*User Details:*
- *Email:* ${user?.email || 'N/A'}
- *UID:* ${user?.uid || 'N/A'}
    `;

    const whatsappUrl = `https://wa.me/2349167689200?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    submit();
    form.reset();
  };

  const handleDismiss = () => {
    dismiss();
    form.reset();
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-[480px] glass-card">
        <DialogHeader className="text-center items-center">
            <div className="p-3 bg-primary/10 rounded-full inline-block mb-2">
                <Sparkles className="h-8 w-8 text-primary" />
            </div>
          <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
          <DialogDescription>
            Your insights help us improve WebIntel. How has your experience been so far?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div className="flex justify-center py-2">
                        <StarRating rating={field.value} onRatingChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Rating</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What did you like or what could be improved?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDismiss}>
                    I'll Rate Later
                </Button>
                <Button type="submit">
                    <Send className="mr-2" /> Publish Review
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
