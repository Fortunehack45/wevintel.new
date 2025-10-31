
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Mail, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Your message should be at least 10 characters long.' }),
});

export default function ContactPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const subject = `Contact Form Message from ${values.name}`;
    const body = `
      You have received a new message from your website contact form.

      Here are the details:
      --------------------------
      Name: ${values.name}
      Email: ${values.email}
      --------------------------
      
      Message:
      ${values.message}
    `;
    const mailtoLink = `mailto:fortunedomination@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-12">
      <div className="mb-8">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-4">
        <Send className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">Get In Touch</h1>
        <p className="text-lg text-muted-foreground">Have a question or want to work together? Drop me a message.</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="Your Name" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                     <div className="relative">
                        <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Textarea placeholder="Tell me about your project or query..." {...field} className="pl-10 min-h-[150px]" />
                        </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
