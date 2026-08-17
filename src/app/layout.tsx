import { Effect } from 'effect';
import type { Metadata } from 'next';
import React from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers/session-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthStoreSyncer } from '@/components/utils/auth-store-syncer';
import { PublicConfig } from '@/config/public-config';
import { appRuntime } from '@/lib/effect/runtime';
import { inter } from '@/styles/fonts';

import '@/styles/globals.css';

const publicConfig = PublicConfig.Service.pipe(
  Effect.flatMap((service) => service.get),
  appRuntime.runSync,
);

export const metadata: Metadata = {
  title: {
    template: '%s | Electronic Store',
    default: 'Electronic Store',
  },
  metadataBase: publicConfig.baseUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
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
