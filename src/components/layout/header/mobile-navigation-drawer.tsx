'use client';

import { X, Menu, ShoppingCart, Heart } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { NavLink } from '@/components/ui/nav-link';
import { paths } from '@/config/paths';

import { navigationSections } from './config';
import { UserMenuMobile } from './user-menu-mobile';

type NavigationSectionProps = {
  title: string;
  links: readonly {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
  onClose: () => void;
};

function NavigationSection({ title, links, onClose }: NavigationSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-muted-foreground uppercase tracking-wide px-4">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {links.map((link) => (
          <Button
            key={link.label}
            asChild
            variant="ghost"
            className="text-base justify-start"
            onClick={onClose}
          >
            <NavLink href={link.href} activeClassName="bg-accent">
              <link.icon className="size-5" />
              {link.label}
            </NavLink>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function MobileNavigationDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" size="icon-circle">
          <Menu className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerDescription className="sr-only">
          Mobile navigation drawer
        </DrawerDescription>

        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose asChild>
            <Button
              aria-label="Close menu"
              variant="ghost"
              size="icon-circle"
              className="size-8"
            >
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col p-4 gap-6">
          {/* User Section */}
          <UserMenuMobile onClose={() => setOpen(false)} />

          {/* Main Navigation */}
          <NavigationSection
            title={navigationSections.public.title}
            links={navigationSections.public.links}
            onClose={() => setOpen(false)}
          />

          {/* Account Actions */}
          <div className="space-y-2">
            <h3 className="font-medium text-muted-foreground uppercase tracking-wide px-4">
              Actions
            </h3>
            <div className="flex flex-col gap-1">
              <Button
                asChild
                variant="ghost"
                className="text-base justify-start"
                onClick={() => setOpen(false)}
              >
                <NavLink
                  href={paths.cart.getHref()}
                  activeClassName="bg-accent"
                >
                  <ShoppingCart className="size-5" />
                  Cart
                </NavLink>
              </Button>
              <Button
                variant="ghost"
                className="text-base justify-start"
                disabled
                title="Favorites is disabled"
              >
                <Heart className="size-5" />
                Favorites
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
