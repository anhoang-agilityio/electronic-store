'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { paths } from '@/config/paths';
import { useBreakpoints } from '@/hooks/use-breakpoints';
import { chunkArray } from '@/utils/array';

type CategoryCard = {
  id: string;
  name: string;
  image: string;
};

type CategoryListUIProps = {
  categories: CategoryCard[];
};

export function CategoryListUI({ categories }: CategoryListUIProps) {
  const { isSmScreen, isMdScreen } = useBreakpoints();
  const router = useRouter();
  const slides =
    isSmScreen || isMdScreen
      ? chunkArray(categories, 3)
      : categories.map((c) => [c]);

  return (
    <Carousel
      className="w-full"
      opts={{
        align: 'start',
        loop: false,
        slidesToScroll: 1,
      }}
    >
      <div className="max-w-screen-xl mx-auto px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-black">
            Browse By Category
          </h2>
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <CarouselPrevious
              variant="ghost"
              size="icon-circle"
              className="static translate-none"
            />
            <CarouselNext
              variant="ghost"
              size="icon-circle"
              className="static translate-none"
            />
          </div>
        </div>
        {/* Carousel */}
        <div className="w-full">
          <CarouselContent className="-ml-4 md:-ml-8">
            {slides.map((group, idx) => (
              <CarouselItem
                key={idx}
                className={
                  isSmScreen || isMdScreen
                    ? 'pl-4 md:pl-8 basis-1/2 flex flex-col'
                    : 'pl-4 md:pl-8 basis-1/6'
                }
              >
                {group.map((category) => (
                  <button
                    key={category.id}
                    className="w-full cursor-pointer mb-4 last:mb-0"
                    onClick={() => {
                      router.push(paths.category(category.id).getHref());
                    }}
                  >
                    <div className="bg-input rounded-2xl p-6 h-32 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:bg-accent">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={48}
                        height={48}
                      />
                      <span className="text-sm font-medium text-center">
                        {category.name}
                      </span>
                    </div>
                  </button>
                ))}
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </div>
    </Carousel>
  );
}
