'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type NavLinkProps = React.PropsWithChildren<LinkProps> & {
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  exact?: boolean;
};

export function NavLink({
  href,
  className,
  activeClassName,
  style,
  activeStyle,
  exact = false,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  // Next.js href can be string or UrlObject, but for active check, we use string
  const linkPath = typeof href === 'string' ? href : (href.pathname ?? '');
  const isActive = exact
    ? pathname === linkPath
    : pathname === linkPath || pathname.startsWith(linkPath + '/');

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
}
