'use client';

import { Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function SearchBarButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Md & Lg screens: Icon only */}
      <Button
        variant="secondary"
        size="icon-rec"
        className="hidden sm:max-lg:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-6 text-muted-foreground" />
      </Button>
      {/* Other screens: Full search bar appearance */}
      <button
        type="button"
        aria-label="Open search"
        className="sm:max-lg:hidden block relative w-full max-w-md mx-auto text-left cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
        <span className="block w-full pl-12 pr-4 py-4 rounded-md bg-input text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-primary transition">
          Search
        </span>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-[calc(100%-2rem)] lg:max-w-5xl top-4 translate-y-0"
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
