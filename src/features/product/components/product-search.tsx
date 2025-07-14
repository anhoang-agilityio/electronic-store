'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { paths } from '@/config/paths';

import { useSearchProduct } from '../hooks';

export function ProductSearch() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { searchResults, isPending, search } = useSearchProduct({
    pageSize: 10,
  });

  const router = useRouter();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    search(value);
  };

  // Handle product selection
  const handleProductSelect = (product: { id: string; categoryId: string }) => {
    setOpen(false);
    setSearchQuery('');

    const href = paths
      .category(product.categoryId)
      .product(product.id)
      .getHref();
    router.push(href);
  };

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
        shouldFilter={false}
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-[calc(100%-2rem)] lg:max-w-5xl top-4 translate-y-0"
      >
        <CommandInput
          placeholder="Search products..."
          value={searchQuery}
          onValueChange={handleSearchChange}
        />
        <CommandList>
          {searchQuery.trim() && (
            <>
              {isPending ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <CommandList>
                  <CommandGroup heading="Products">
                    {searchResults.map((product) => (
                      <CommandItem
                        key={product.id}
                        onSelect={() => handleProductSelect(product)}
                      >
                        {product.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
