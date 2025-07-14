import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href={paths.home.getHref()}>
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
}
