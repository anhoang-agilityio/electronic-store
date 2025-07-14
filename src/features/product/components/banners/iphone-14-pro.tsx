import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function Iphone14ProBanner() {
  return (
    <section className="w-full h-full bg-primary">
      <div className="max-w-7xl px-4 sm:px-8 pt-22 sm:pt-0 mx-auto flex flex-col sm:flex-row items-center gap-12 sm:gap-4 justify-between">
        {/* Content */}
        <div className="flex flex-col gap-8 sm:gap-6 items-center sm:items-start">
          <div className="flex flex-col gap-4 sm:gap-6 text-center sm:text-start">
            <div className="flex flex-col gap-4 sm:gap-2">
              <span className="text-primary-foreground text-2xl font-semibold opacity-40">
                Pro.Beyond.
              </span>
              <h1 className="text-primary-foreground text-7xl md:text-8xl">
                <span className="font-thin">IPhone 14 </span>
                <span className="font-semibold">Pro</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-lg">
              Created to change everything for the better. For everyone
            </p>
          </div>
          <Button
            variant="outline"
            size="xl"
            className="text-primary-foreground bg-primary"
            asChild
          >
            <Link
              href={paths.category('phone').product('iphone-14-pro').getHref()}
            >
              Shop Now
            </Link>
          </Button>
        </div>
        {/* Banner Image */}
        <div className="w-[321px] sm:w-[406px] h-[289px] sm:h-158 flex items-end">
          <div className="h-full sm:h-3/4 w-full relative ">
            <Image
              src="/iphone-14-pro.png"
              alt="iPhone 14 Pro Banner"
              className="object-cover object-top-left"
              fill
            />
          </div>
        </div>
      </div>
    </section>
  );
}
