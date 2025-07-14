'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { paths } from '@/config/paths';
import { getInitials } from '@/utils/string';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex size-12 items-center justify-center">
        <div className="size-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Button variant="ghost" size="icon-circle" asChild>
        <Link href={paths.auth.signin.getHref()}>
          <User className="size-6" />
        </Link>
      </Button>
    );
  }

  const { user } = session;
  const initials = user.name ? getInitials(user.name, 2) : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-circle" className="relative">
          <Avatar className="size-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href={paths.profile.getHref()}>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => void signOut({ callbackUrl: paths.home.getHref() })}
        >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
