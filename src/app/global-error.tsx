'use client';

import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-secondary">
          <div className="max-w-md w-full bg-background rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto size-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <TriangleAlert className="size-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
              <p className="text-muted-foreground mb-6">
                Sorry, an error has occurred. Please try again or contact
                support if the problem persists.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>

              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="w-full"
              >
                Go to homepage
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
