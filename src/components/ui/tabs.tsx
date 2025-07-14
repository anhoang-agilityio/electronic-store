'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'flex w-fit gap-8 mb-8 bg-transparent shadow-none border-none p-0 h-8 items-center',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'cursor-pointer relative h-8 px-0 text-base font-medium bg-transparent border-none rounded-none shadow-none flex items-center justify-center whitespace-nowrap',
        'text-muted-foreground data-[state=active]:text-foreground',
        "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-current",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
