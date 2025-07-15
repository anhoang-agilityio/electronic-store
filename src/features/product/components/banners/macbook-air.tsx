import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function MacbookAirBanner() {
  return (
    <section className="w-full h-full bg-secondary">
      <div className="max-w-7xl px-4 sm:pl-14 sm:pr-0 py-10 sm:py-11 mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-3 justify-between">
        {/* Content */}
        <div className="flex flex-col gap-4 items-center sm:items-start sm:text-start">
          <h1 className="text-secondary-foreground text-4xl sm:text-6xl">
            <span className="font-thin">MacBook </span>
            <span className="font-semibold">Air</span>
          </h1>
          <p className="text-muted-foreground font-medium text-base sm:text-sm max-w-lg">
            The new 15‑inch MacBook Air makes room for more of what you love
            with a spacious Liquid Retina display.
          </p>
          <Button
            variant="outline"
            size="xl"
            className="bg-secondary self-stretch sm:self-auto"
            asChild
          >
            <Link
              href={paths
                .category('computer')
                .product('macbook-air-m2-15')
                .getHref()}
            >
              Shop Now
            </Link>
          </Button>
        </div>
        {/* Banner Image */}
        <div className="w-3/4 sm:w-1/2 h-[200px] sm:h-[502px] order-first sm:order-last shrink-[0.5] relative">
          <Image
            src="/macbook-air.png"
            alt="MacBook Air Banner"
            className="object-contain sm:object-cover sm:object-left"
            sizes="(min-width: 640px) 50vw, 75vw"
            fill
          />
        </div>
      </div>
    </section>
  );
}
