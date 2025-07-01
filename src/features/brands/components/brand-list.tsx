'use client';

import {
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Monitor,
  Gamepad2,
} from 'lucide-react';
import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Simple mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

type CategoryCard = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: CategoryCard[] = [
  { id: 'phones', name: 'Phones', icon: Smartphone },
  { id: 'smart-watches', name: 'Smart Watches', icon: Watch },
  { id: 'cameras', name: 'Cameras', icon: Camera },
  { id: 'headphones', name: 'Headphones', icon: Headphones },
  { id: 'computers', name: 'Computers', icon: Monitor },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  { id: 'headphones1', name: 'Headphones1', icon: Headphones },
  { id: 'computers1', name: 'Computers1', icon: Monitor },
  { id: 'gaming1', name: 'Gaming1', icon: Gamepad2 },
];

// Helper to chunk array into pairs
function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function BrandList() {
  const isMobile = useIsMobile();
  // For mobile: chunk into pairs of 3, for desktop: each card is a slide
  const slides = isMobile
    ? chunkArray(categories, 3)
    : categories.map((c) => [c]);

  return (
    <Carousel
      className="w-full bg-[#FAFAFA] py-20"
      opts={{
        align: 'start',
        loop: false,
        slidesToScroll: 1,
      }}
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-40">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-black">
            Browse By Category
          </h2>
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <CarouselPrevious
              variant="ghost"
              size="icon-rec"
              className="h-8 w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50"
            />
            <CarouselNext
              variant="ghost"
              size="icon-rec"
              className="h-8 w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50"
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
                  isMobile
                    ? 'pl-4 md:pl-8 basis-1/2 flex flex-col'
                    : 'pl-4 md:pl-8 basis-1/6'
                }
              >
                {group.map((category) => (
                  <div
                    key={category.id}
                    className="group cursor-pointer mb-4 last:mb-0"
                  >
                    <div className="bg-[#EDEDED] rounded-[15px] p-6 h-32 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-200">
                      <category.icon className="h-12 w-12 text-black" />
                      <span className="text-sm font-medium text-black text-center">
                        {category.name}
                      </span>
                    </div>
                  </div>
                ))}
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </div>
    </Carousel>
  );
}
