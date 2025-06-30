'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/ui/nav-link';

import { navigationSections } from './config';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';
import { SearchBarButton } from './search-bar-button';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 border">
      {/* Mobile: Logo + Burger */}
      <div className="flex w-full items-center justify-between gap-4 sm:hidden">
        <Image src="/logo.svg" alt="Logo" width={66} height={24} />
        <SearchBarButton />
        <MobileNavigationDrawer />
      </div>
      {/* Desktop: Logo + Search + Nav + Icons */}
      <>
        <div className="hidden sm:flex flex-shrink-0">
          <Image src="/logo.svg" alt="Logo" width={66} height={24} />
        </div>
        <div className="hidden sm:flex md:flex-1 justify-center ml-12">
          <div className="w-full max-w-lg">
            <SearchBarButton />
          </div>
        </div>
        <nav className="hidden sm:flex flex-1 md:flex-initial md:gap-13 md:mx-12 items-center justify-evenly">
          {navigationSections.public.links.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              className="text-muted-foreground font-medium"
              activeClassName="text-foreground"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden sm:flex items-center">
          {navigationSections.user.links.map((link) => (
            <Button key={link.label} variant="ghost" size="icon-circle">
              <link.icon className="size-6" />
            </Button>
          ))}
        </div>
      </>
    </header>
  );
}
