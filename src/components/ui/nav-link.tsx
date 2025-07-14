'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { withSuspense } from '@/components/utils/with-suspense';
import { cn } from '@/lib/utils';

export type NavLinkProps = React.PropsWithChildren<LinkProps> & {
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  exact?: boolean;
  // Custom active state determination
  isActive?: (
    pathname: string,
    searchParams: URLSearchParams,
    href: string,
  ) => boolean;
  // For search param based active state
  activeSearchParam?: string;
  activeSearchValue?: string;
  // For multiple search param values or default value handling
  activeSearchValues?: string[];
  defaultActiveValue?: string;
};

export const NavLink = withSuspense(function ({
  href,
  className,
  activeClassName,
  style,
  activeStyle,
  exact = false,
  isActive: customIsActive,
  activeSearchParam,
  activeSearchValue,
  activeSearchValues,
  defaultActiveValue,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Next.js href can be string or UrlObject, but for active check, we use string
  const linkPath = typeof href === 'string' ? href : (href.pathname ?? '');

  let isActive = false;

  // Custom active state function takes priority
  if (customIsActive) {
    isActive = customIsActive(pathname, searchParams, linkPath);
  }
  // Search param based active state
  else if (activeSearchParam) {
    const currentValue = searchParams.get(activeSearchParam);

    // Handle multiple values
    if (activeSearchValues && activeSearchValues.length > 0) {
      isActive = activeSearchValues.includes(currentValue ?? '');
    }
    // Handle single value with default
    else if (activeSearchValue) {
      if (!currentValue && defaultActiveValue) {
        isActive = activeSearchValue === defaultActiveValue;
      } else {
        isActive = currentValue === activeSearchValue;
      }
    }
    // Handle default value only
    else if (defaultActiveValue) {
      isActive = !currentValue || currentValue === defaultActiveValue;
    }
  }
  // Default pathname based active state
  else {
    isActive = exact
      ? pathname === linkPath
      : pathname === linkPath || pathname.startsWith(linkPath + '/');
  }

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      style={isActive ? { ...style, ...activeStyle } : style}
      {...props}
    >
      {children}
    </Link>
  );
});
