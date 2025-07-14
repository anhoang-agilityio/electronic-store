'use client';

import { X, Menu } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { NavLink } from '@/components/ui/nav-link';

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
        <Button variant="ghost" size="icon-circle">
          <Menu className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-circle" className="size-8">
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
                  href={navigationSections.cart.href}
                  activeClassName="bg-accent"
                >
                  <navigationSections.cart.icon className="size-5" />
                  {navigationSections.cart.label}
                </NavLink>
              </Button>
              <Button
                variant="ghost"
                className="text-base justify-start"
                disabled
                title="Favorites is disabled"
              >
                <navigationSections.favorites.icon className="size-5" />
                {navigationSections.favorites.label}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
