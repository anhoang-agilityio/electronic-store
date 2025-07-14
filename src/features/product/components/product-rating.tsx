import React from 'react';

import { RatingStars } from '@/components/ui/rating-stars';

type ProductRatingProps = {
  rating: number;
  reviewCount: number;
};

export function ProductRating({ rating, reviewCount }: ProductRatingProps) {
  return (
    <div className="bg-muted rounded-[25px] max-w-80 md:w-min flex md:flex-col justify-center items-center p-8 gap-4">
      <div className="flex flex-col items-center md:items-start md:gap-4 md:flex-1">
        <span className="text-[56px] font-bold leading-none">
          {rating.toFixed(1)}
        </span>
        <span className="text-base text-foreground/70 w-max">
          of {reviewCount} reviews
        </span>
      </div>
      <RatingStars rating={rating} />
    </div>
  );
}
