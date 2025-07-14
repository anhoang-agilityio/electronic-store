'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
          <Button asChild>
            <Link href={paths.auth.signin.getHref()}>Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">User ID</label>
              <p className="mt-1 text-sm text-gray-900">{session.user?.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Name</label>
              <p className="mt-1 text-sm text-gray-900">{session.user?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <p className="mt-1 text-sm text-gray-900">
                {session.user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => void signOut({ callbackUrl: '/' })}
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
