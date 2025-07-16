import Link from 'next/dist/client/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function VisionProBanner() {
  return (
    <section className="w-full h-full bg-primary/90">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-10 sm:pl-0 sm:pr-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
        {/* Image */}
        <div className="w-[325px] h-[192px] sm:w-[136px] sm:h-[190px] relative">
          <Image
            src="/vision-pro.png"
            alt="Vision Pro Banner"
            fill={true}
            sizes="(min-width: 40rem) 136px, 325px"
            className="object-contain sm:object-cover sm:object-right"
          />
        </div>
        {/* Title + Description */}
        <div className="flex flex-col gap-4 max-w-xl items-center sm:items-stretch text-center sm:text-left">
          <Button
            variant="link"
            asChild
            className="p-0 justify-start text-primary-foreground"
          >
            <Link
              href={paths
                .category('vision')
                .product('apple-vision-pro')
                .getHref()}
            >
              <h1 className="text-4xl sm:text-3xl">
                <span className="font-light">Vision </span>
                <span className="font-medium">Pro</span>
              </h1>
            </Link>
          </Button>
          <p className="text-secondary/70 text-base sm:text-sm font-medium">
            An immersive way to experience entertainment
          </p>
        </div>
      </div>
    </section>
  );
}
