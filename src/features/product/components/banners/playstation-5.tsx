import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function Playstation5Banner() {
  return (
    <section className="w-full h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:p-0 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12">
        {/* Image */}
        <div className="size-50 sm:w-1/2 sm:h-[343px] relative">
          <Image
            src="/playstation-5.png"
            alt="PlayStation 5 Banner"
            fill={true}
            sizes="(min-width: 640px) 50vw, 50rem"
            className="object-contain sm:object-cover sm:object-right"
          />
        </div>
        {/* Title + Description */}
        <div className="flex flex-col gap-2 sm:gap-6 max-w-xl sm:mr-12 text-center sm:text-left">
          <Button asChild variant="link" className="self-start p-0">
            <Link
              href={paths
                .category('gaming')
                .product('sony-playstation-5')
                .getHref()}
            >
              <h1 className="text-foreground text-4xl sm:text-5xl">
                <span className="font-thin">Playstation </span>
                <span className="font-medium">5</span>
              </h1>
            </Link>
          </Button>
          <p className="text-muted-foreground text-base font-medium">
            Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will
            redefine your PlayStation experience.
          </p>
        </div>
      </div>
    </section>
  );
}
