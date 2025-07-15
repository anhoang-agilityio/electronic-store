import type { Metadata } from 'next';
import React from 'react';

import { Footer } from '@/components/layout/footer/footer';
import { Header } from '@/components/layout/header/header';
import { Providers } from '@/components/providers/session-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthStoreSyncer } from '@/components/utils/auth-store-syncer';
import { AxeDevtools } from '@/components/utils/axe';
import { env } from '@/config/env';
import { inter } from '@/styles/fonts';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Electronic Store',
    default: 'Electronic Store',
  },
  metadataBase: new URL(env.BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AxeDevtools />
        <Providers>
          <AuthStoreSyncer />
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
