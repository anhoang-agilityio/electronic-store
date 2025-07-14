'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/ui/nav-link';
import { paths } from '@/config/paths';
import { ProductSearch } from '@/features/product/components/product-search';

import { navigationSections } from './config';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';
import { UserMenu } from './user-menu';

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b">
      {/* Mobile: Logo + Burger */}
      <div className="flex w-full items-center justify-between gap-4 sm:hidden">
        <Link href={paths.home.getHref()}>
          <Image src="/logo.svg" alt="Logo" width={66} height={24} />
        </Link>
        <ProductSearch />
        <MobileNavigationDrawer />
      </div>
      {/* Desktop: Logo + Search + Nav + Icons */}
      <>
        <div className="hidden sm:flex flex-shrink-0">
          <Link href={paths.home.getHref()}>
            <Image src="/logo.svg" alt="Logo" width={66} height={24} />
          </Link>
        </div>
        <div className="hidden sm:flex md:flex-1 justify-center ml-12">
          <div className="w-full max-w-lg">
            <ProductSearch />
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
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="icon-circle" asChild>
            <NavLink
              href={navigationSections.cart.href}
              activeClassName="text-foreground"
            >
              <navigationSections.cart.icon className="size-6" />
            </NavLink>
          </Button>
          <Button
            variant="ghost"
            size="icon-circle"
            disabled
            title="Favorites is disabled"
          >
            <navigationSections.favorites.icon className="size-6 opacity-40" />
          </Button>
          <UserMenu />
        </div>
      </>
    </header>
  );
}
