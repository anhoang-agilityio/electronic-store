'use client';

import { LogOut, User, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/ui/nav-link';
import { paths } from '@/config/paths';
import { getInitials } from '@/utils/string';

type UserMenuMobileProps = {
  onClose: () => void;
};

export function UserMenuMobile({ onClose }: UserMenuMobileProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="size-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-muted-foreground uppercase tracking-wide px-4">
          Account
        </h3>
        <Button
          asChild
          variant="ghost"
          className="text-base justify-start w-full"
          onClick={onClose}
        >
          <Link href={paths.auth.signin.getHref()}>
            <User className="size-5 mr-3" />
            Sign in
          </Link>
        </Button>
      </div>
    );
  }

  const { user } = session;
  const initials = user.name ? getInitials(user.name, 2) : 'U';

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/' });
    onClose();
  };

  return (
    <div className="space-y-3">
      {/* User Info Card */}
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mx-4">
        <Avatar className="size-12">
          <AvatarFallback className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          asChild
          className="text-base justify-start"
          onClick={onClose}
        >
          <NavLink href={paths.profile.getHref()} activeClassName="bg-accent">
            <UserIcon className="size-5 mr-3" />
            <span>My Profile</span>
          </NavLink>
        </Button>

        <Button
          variant="ghost"
          className="text-base justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="size-5 mr-3" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
