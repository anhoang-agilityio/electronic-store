import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function SummerSaleBanner() {
  return (
    <div className="relative w-full aspect-[750/1024] sm:aspect-[2880/896] flex items-center justify-center">
      {/* Background images: desktop and mobile */}
      <Image
        src="/summer-sale.png"
        alt="Summer Sale Background"
        fill
        className="object-cover hidden sm:block"
        sizes="(min-width: 640px) 100vw, 0vw"
      />
      <Image
        src="/summer-sale-mobile.png"
        alt="Summer Sale Mobile Background"
        fill
        className="object-cover block sm:hidden"
        sizes="(max-width: 640px) 100vw, 0vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/30" />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-10 px-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-primary-foreground text-5xl sm:text-7xl">
            <span className="font-thin">Big Summer</span>
            <span className="font-medium"> Sale</span>
          </h2>
          <p className="text-muted-foreground">
            Commodo fames vitae vitae leo mauris in. Eu consequat.
          </p>
        </div>
        <Button
          variant="outline"
          size="xl"
          className="text-primary-foreground bg-primary/30"
          asChild
        >
          <Link href={paths.category('phone').getHref()}>Shop Now</Link>
        </Button>
      </div>
    </div>
  );
}
