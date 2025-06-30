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
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-circle" className="w-8 h-8">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col p-4 gap-6">
          {Object.entries(navigationSections).map(([key, section]) => (
            <NavigationSection
              key={key}
              title={section.title}
              links={section.links}
              onClose={() => setOpen(false)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
