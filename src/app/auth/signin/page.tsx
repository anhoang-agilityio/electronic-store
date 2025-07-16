'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { withSuspense } from '@/components/utils/with-suspense';

const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignInFormValues = z.infer<typeof SignInSchema>;

const SignInPage = withSuspense(function () {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setServerError('');
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setServerError('Invalid email or password.');
      } else {
        toast.success('Sign in successful!', {
          description: 'Welcome back!',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-background rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Sign in to your account
          </h1>
          <p className="text-muted-foreground text-base">
            Please enter your email and password to continue.
          </p>
        </div>
        <form
          className="space-y-6"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          autoComplete="off"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <div className="text-destructive text-sm text-center bg-red-50 border border-red-200 rounded p-2">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base font-semibold"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
});

export default SignInPage;
