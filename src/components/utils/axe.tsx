'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export function AxeDevtools() {
  useEffect(() => {
    // Only enable axe accessibility checks in development on the client
    if (
      process.env.NODE_ENV !== 'production' &&
      typeof window !== 'undefined'
    ) {
      void import('@axe-core/react').then((axeModule) => {
        const axe = axeModule as {
          default: (a: typeof React, b: typeof ReactDOM, c: number) => void;
        };
        axe.default(React, ReactDOM, 1000);
      });
    }
  }, []);

  return null;
}
