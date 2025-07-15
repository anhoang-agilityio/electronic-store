'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { BreadcrumbSkeleton } from './breadcrumb-skeleton';
import { useGenerateBreadcrumbItems } from './use-generate-breadcrumb-items';

export function AppBreadcrumb() {
  const { breadcrumbItems, isLoading } = useGenerateBreadcrumbItems();

  if (isLoading) {
    return <BreadcrumbSkeleton />;
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="px-8">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage className="text-base font-bold">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href ?? '#'}
                    className="text-base font-medium text-muted-foreground hover:text-accent-foreground hover:underline transition-all"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="text-foreground" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
